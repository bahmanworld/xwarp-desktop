import { app, BrowserWindow, ipcMain, Tray, shell } from "electron";
import path from "node:path";
import fs from 'fs'
import { spawn, execSync, ChildProcessWithoutNullStreams } from "child_process";
import { Storage } from "./Storage";
import { download } from "./utils";

process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

let child: ChildProcessWithoutNullStreams | null = null;

const WIDTH = 300;
const HEIGHT = 500;

function createWindow() {

  new Tray(path.join(process.env.DIST, "logo.png"))

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
    e.preventDefault();
    app?.hide();
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

ipcMain.on("warp:connect", (_, settings: SettingsArgs) => {
  const args = [];
  const stuffDir = path.join(app.getPath("home"), ".xwarp");
  if (fs.existsSync(stuffDir)) execSync(`rm -rf ${stuffDir}`);
  args.push(`-s ${stuffDir}`);
  settings.endpoint && args.push(`-e ${settings.endpoint}`);
  settings.port && args.push(`-b 127.0.0.1:${settings.port}`);
  settings.key && args.push(`-k ${settings.key}`);
  settings.gool && args.push(`--gool`);
  settings.psiphon && args.push(`--cfon --country ${settings.country}`);

  let flagName = "";
  if (VITE_DEV_SERVER_URL) {
    flagName = path.join(process.env.VITE_PUBLIC, "warp-plus");
  } else {
    flagName = path.join(process.env.DIST, "warp-plus");
  }
  child = spawn(flagName, args, { shell: true });
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (data) => {
    win?.webContents.send("logs", (data as string).trim());
    const connected = (data as string).includes(
      `address=127.0.0.1:${settings.port || 8086}`
    );
    if (connected) {
      win?.webContents.send("warp:connected", true);
      execSync("networksetup -setsocksfirewallproxystate Wi-Fi on");
      execSync(
        `networksetup -setsocksfirewallproxy Wi-Fi 127.0.0.1 ${
          settings.port || 8086
        }`
      );
    }
  });

  child.on("error", (e) => {
    child?.kill();
  });
});

ipcMain.on("warp:disconnect", () => {
  execSync("networksetup -setsocksfirewallproxystate Wi-Fi off");
  child?.kill();
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
  child?.kill();
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
