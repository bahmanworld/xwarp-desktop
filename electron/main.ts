import { app, BrowserWindow, ipcMain, Tray } from "electron";
import path from "node:path";
import childProcess from "child_process";
import { Storage } from "./Storage";

process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

const WIDTH = 350;
const HEIGHT = 600;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "logo.png"),
    maximizable: false,
    fullscreenable: false,
    center: true,
    resizable: false,
    titleBarStyle: "hidden",
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

  if (!VITE_DEV_SERVER_URL) {
    win.on("close", function (evt) {
      evt.preventDefault();
      app.hide();
    });
  }

  new Tray(path.join(process.env.VITE_PUBLIC, "logo.png"));

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

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
});

let cli: childProcess.ChildProcessWithoutNullStreams | null = null;

ipcMain.on("warp:connect", (_, settings) => {
  console.log(settings);
  cli = childProcess.spawn("ping", ["localhost"]);
  cli.stdout.setEncoding("utf8");
  cli.stdout.on("data", (data) => {
    console.log(data);
    win?.webContents.send("logs", data);
    const fields = data.split(" ") as string[];
    const field = fields.find((i) => i.includes("icmp_seq=5"));
    if (field) {
      win?.webContents.send("warp:connected", true);
    }
  });
  // cli.stdout.on("resume", () => {
  //   console.log("start/resume");
  //   win?.webContents.send("warp:connected", true);
  // });
  cli.on("error", () => {
    console.log("error");
    cli?.kill();
    win?.webContents.send("warp:connected", false);
  });
});

ipcMain.on("warp:disconnect", () => {
  cli?.kill();
});

ipcMain.on("app:quit", () => {
  cli?.kill();
  app.exit();
});

ipcMain.on("settings:set", (_, key, value) => {
  console.log("server:", key, value);
  Storage.instance.set(key, value);
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
