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
    settings: {
      set: (key: string, value: unknown) => void;
      get: (key: string) => any;
      delete: (key: string) => void;
      clear: () => void;
    };
    connect: (
      settings: any,
      callback: (e: Electron.IpcRendererEvent, args: any[]) => void
    ) => void;
    disconnect: () => void;
    quit: () => void;
    // logs: (callback: (data: any) => void) => void;
    openExternalLink: (url: string) => void;
    download: (
      callback: (error: Error | null, finished: boolean) => void
    ) => void;
  };
}
