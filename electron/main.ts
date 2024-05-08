import {
  app,
  BrowserWindow,
  ipcMain,
  nativeImage,
  shell,
  Tray,
} from "electron";
import path from "node:path";
import { spawn, execSync, ChildProcessWithoutNullStreams } from "child_process";
import { Storage } from "./Storage";
import { download } from "./utils";

process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public"); // 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

let win: BrowserWindow | null;
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

app.on("before-quit", (e) => {
  if (isConnected) {
    e.preventDefault();
    win?.webContents.send("app:will-quit");
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

ipcMain.on("warp:connect", (_, settings: SettingsArgs) => {
  console.log("connecting...");
  const stuffDir = path.join(app.getPath("home"), ".xwarp-cache");
  const args = [];
  args.push(`--cache-dir ${stuffDir}`);
  settings.endpoint && args.push(`-e ${settings.endpoint}`);
  settings.port && args.push(`-b 127.0.0.1:${settings.port}`);
  settings.key && args.push(`-k ${settings.key}`);
  settings.gool && args.push(`--gool`);
  settings.psiphon && args.push(`--cfon --country ${settings.country}`);

  let flagName = "";
  flagName = path.join(process.env.VITE_PUBLIC, 'bin', "warp-plus");
  child = spawn(flagName, args, { shell: true });
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (data) => {
    console.log(data);
    win?.webContents.send("logs", (data as string).trim());
    const connected = (data as string).includes(
      `address=127.0.0.1:${settings.port || 8086}`
    );
    if (connected) {
      execSync("networksetup -setsocksfirewallproxystate Wi-Fi on");
      execSync(
        `networksetup -setsocksfirewallproxy Wi-Fi 127.0.0.1 ${
          settings.port || 8086
        }`
      );
      win?.webContents.send("warp:connected", true);
      isConnected = true;
    }
  });

  child.on("error", (e) => {
    child?.kill();
  });
});

ipcMain.on("warp:disconnect", () => {
  execSync("networksetup -setsocksfirewallproxystate Wi-Fi off");
  child?.kill();
  isConnected = false;
});

ipcMain.on("app:quit", () => {
  execSync("networksetup -setsocksfirewallproxystate Wi-Fi off");
  child?.kill();
  app.exit();
});

ipcMain.on("app:path", (e) => {
  const appPath = app.getPath("home");
  e.returnValue = appPath;
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
