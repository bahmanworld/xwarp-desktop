import { create } from "zustand";
import { useSettings } from "./useSettings";

type WarpProps = {
  log: string;
  connected: boolean;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
  clearLogs: () => void;
};

export const useWarp = create<WarpProps>()((set, get) => ({
  log: "",
  connected: false,
  connecting: false,
  connect: () => {
    if (get().connecting) {
      get().disconnect();
      window.electron.disconnect();
      return;
    }
    set({ connecting: true });
    window.electron.logs((data) => {
      set({ log: data });
    });
    window.electron.connect(
      useSettings.getState().getSettings(),
      (_, connected) => {
        if (connected) {
          set({ connected: true, connecting: false });
        } else {
          set({ connected: false, connecting: false });
        }
      }
    );
  },
  disconnect: () => {
    set({ log: "", connected: false, connecting: false });
    window.electron.disconnect();
  },
  clearLogs: () => {
    set({ log: "" });
  },
}));
