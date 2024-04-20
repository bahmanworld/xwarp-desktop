import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("client", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },

  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },

  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },

  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  settings: {
    set: (key: string, value: unknown) => {
      ipcRenderer.send("settings:set", key, value);
    },

    get: (key: string) => {
      return ipcRenderer.sendSync("settings:get", key);
    },

    delete: (key: string) => {
      ipcRenderer.send("settings:delete", key);
    },

    clear: () => {
      ipcRenderer.send("settings:clear");
    },
  },

  connect: (
    settings: any,
    callback: (e: Electron.IpcRendererEvent, args: any[]) => void
  ) => {
    ipcRenderer.send("warp:connect", settings);
    ipcRenderer.on("warp:connected", callback);
  },

  disconnect: () => {
    ipcRenderer.send("warp:disconnect");
  },

  quit: () => {
    ipcRenderer.send("app:quit");
  },

  logs: (callback: (e: any, data: any) => void) => {
    ipcRenderer.on("logs", callback);
  },
});
