/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    DIST: string;
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import("electron").IpcRenderer;
  client: {
    connect: (
      settings: any,
      callback: (e: Electron.IpcRendererEvent, args: any[]) => void
    ) => void;
    disconnect: () => void;
    logs: (callback: (e: any, data: any) => void) => void;
    quit: () => void;
    settings: {
      set: (key: string, value: unknown) => void;
      get: (key: string) => any;
      delete: (key: string) => void;
      clear: () => void;
    };
  };
}
