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
      set: (key: string, value: unknown) => void;
      get: (key: string) => any;
      delete: (key: string) => void;
      clear: () => void;
    };
    connect: (
      settings: any,
      callback: (e: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {};
    disconnect: () => void;
    quit: () => void;
    willQuit: (callback: () => void) => void;
    stayOnTop: (stay: boolean) => void,
    logs: (callback: (data: any) => void) => void;
    copy: (value: any) => {},
    platform: () => {},
    openExternalLink: (url: string) => {};
  };
}
