import { create } from "zustand";
import { useSettings } from "./useSettings";

type WarpProps = {
  logs: any[];
  connected: boolean;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
  clearLogs: () => void;
};

export const useWarp = create<WarpProps>()((set, get) => ({
  logs: [],
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
      set({ logs: [...get().logs, data] });
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
    set({ connected: false, connecting: false });
    window.electron.disconnect();
  },
  clearLogs: () => {
    set({ logs: [] });
  },
}));
