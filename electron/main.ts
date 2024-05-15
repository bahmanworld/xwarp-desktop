import {
  app,
  BrowserWindow,
  clipboard,
  ipcMain,
  nativeImage,
  shell,
  Tray,
} from "electron";
import path from "node:path";
import {
  spawn,
  spawnSync,
  ChildProcessWithoutNullStreams,
} from "child_process";
import { Storage } from "./Storage";
import { download } from "./utils";
import fs from "fs";

process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public"); // 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

let win: BrowserWindow | null;
const cacheDir = path.join(app.getPath("home"), ".xwarp-cache");
let child: ChildProcessWithoutNullStreams | null = null;
let isConnected = false;

const WIDTH = 320;
const HEIGHT = 550;

function createWindow() {
  win = new BrowserWindow({
    icon: process.env.VITE_PUBLIC + "logo.png",
    maximizable: false,
    fullscreenable: false,
    center: true,
    resizable: false,
    titleBarStyle: "hiddenInset",
    width: WIDTH,
    height: HEIGHT,
    minWidth: WIDTH,
    minHeight: HEIGHT,
    maxWidth: WIDTH,
    maxHeight: HEIGHT,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.platform == "win32") {
    win?.setMenu(null);
    new Tray(
      nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, "tray.png"))
    );
  }

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  win?.on("close", (e) => {
    if (isConnected) {
      e.preventDefault();
      app?.hide();
    }
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", (e) => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

ipcMain.on("link:open", (_, url) => {
  shell.openExternal(url);
});

type SettingsArgs = {
  endpoint: string;
  key: string;
  port: number;
  psiphon: boolean;
  country: string;
  gool: boolean;
};

let proxyEnbaleSpawn: ChildProcessWithoutNullStreams | null = null;
let proxyInformSpawn: ChildProcessWithoutNullStreams | null = null;

const enableOSProxy = (port: number = 8086) => {
  switch (process.platform) {
    case "win32":
      proxyEnbaleSpawn = spawn(
        `reg`,
        [
          'add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"',
          "/v ProxyEnable",
          "/t REG_DWORD",
          "/d 1",
        ],
        { shell: true }
      ); // windows
      proxyEnbaleSpawn.stdout.setEncoding("utf8")
      proxyEnbaleSpawn.stdout.on('data', console.log)
      proxyInformSpawn = spawn(
        "reg",
        [
          'add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"',
          "/v ProxyServer",
          "/t REG_SZ",
          `/d 127.0.0.1:${port}`,
        ],
        { shell: true }
      ); // windows
      proxyInformSpawn.stdout.setEncoding("utf8")
      proxyInformSpawn.stdout.on('data', console.log)
      break;
    case "darwin":
      spawn(
        "networksetup",
        ["-setsocksfirewallproxystate", "Wi-Fi", "on"],
        {
          shell: true,
        }
      ); // macos
      spawn(
        `networksetup`,
        ["-setsocksfirewallproxy", "Wi-Fi", `127.0.0.1 ${port}`],
        { shell: true }
      ); // macos
      break;
  }
};

const disableOSProxy = () => {
  switch (process.platform) {
    case "win32":
      spawn(
        `reg`,
        [
          'add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"',
          "/v ProxyEnable",
          "/t REG_DWORD",
          "/d 0",
        ],
        { shell: true }
      ); // windows
      break;
    case "darwin":
      spawn("networksetup", ["-setsocksfirewallproxystate", "Wi-Fi", "off"], {
        shell: true,
      }); // macos
      break;
  }
};

ipcMain.on("warp:connect", (_, settings: SettingsArgs) => {
  console.log("connecting...");
  const args = [];
  args.push(`--cache-dir ${cacheDir}`);
  settings.endpoint && args.push(`-e ${settings.endpoint}`);
  settings.port && args.push(`-b 127.0.0.1:${settings.port}`);
  settings.key && args.push(`-k ${settings.key}`);
  settings.gool && args.push(`--gool`);
  settings.psiphon && args.push(`--cfon --country ${settings.country}`);

  const commander = path.join(process.env.VITE_PUBLIC, "bin", "warp-plus");
  console.log(commander);
  child = spawn(commander, args, { shell: true });
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (data) => {
    console.log(data);
    win?.webContents.send("logs", (data as string).trimEnd());
    const connected = (data as string).includes(
      `address=127.0.0.1:${settings.port || 8086}`
    );
    if (connected) {
      enableOSProxy(settings.port || 8086);
      win?.webContents.send("warp:connected", true);
      isConnected = true;
    }
  });

  child.on("error", (e) => {
    child?.kill();
  });

  child.stderr.on("data", () => {
    child?.kill();
    console.log("error");
  });
});

ipcMain.on("warp:disconnect", () => {
  disableOSProxy();
  child?.kill();
  isConnected = false;
});

ipcMain.on("app:quit", () => {
  disableOSProxy();
  child?.kill();
  app.exit();
});

app.on("before-quit", (e) => {
  if (isConnected) {
    e.preventDefault();
    win?.webContents.send("app:will-quit");
    if (fs.existsSync(cacheDir))
      fs.rmSync(cacheDir, { force: true, recursive: true });
  }
});

ipcMain.on("app:stayontop", (e, stay: boolean) => {
  win?.setAlwaysOnTop(stay);
});

ipcMain.on("app:platform", (e, key) => {
  e.returnValue = process.platform;
});

ipcMain.on("clipboard:copy", (e, value) => {
  clipboard.writeText(value, "clipboard");
});

ipcMain.on("settings:set", (_, key, value) => {
  Storage.instance.set(key, value);
  // child?.kill();
});

ipcMain.on("settings:get", (e, key) => {
  e.returnValue = Storage.instance.get(key);
});

ipcMain.on("settings:delete", (_, key) => {
  Storage.instance.delete(key);
});

ipcMain.on("settings:clear", (_) => {
  Storage.instance.clear();
});

ipcMain.on("download:start", (_) => {
  download(
    "https://github.com/bepass-org/warp-plus/releases/download/v1.1.3/warp-plus_darwin-arm64.zip"
  )
    .then(() => {
      win?.webContents.send("download:done");
    })
    .catch(() => {
      win?.webContents.send("download:error");
    });
});
