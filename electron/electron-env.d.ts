/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    DIST: string;
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  electron: {
    settings: {
      set: (key: string, value: unknown) => {};
      get: (key: string) => any;
      delete: (key: string) => {};
      clear: () => {};
    };
    connect: (
      settings: any,
      callback: (e: Electron.IpcRendererEvent, ...args: any[]) => {}
    ) => {};
    disconnect: () => {};
    quit: () => {};
    willQuit: (callback: () => {}) => {};
    stayOnTop: (stay: boolean) => {},
    logs: (callback: (data: any) => {}) => {};
    copy: (value: any) => {},
    openExternalLink: (url: string) => {};
    download: (
      callback: (error: Error | null, finished: boolean) => {}
    ) => {};
  };
}
