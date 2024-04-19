import { create } from "zustand";
import { useSettings } from "./useSettings";

type WarpProps = {
  logs: string[];
  connected: boolean;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
};
export const useWarp = create<WarpProps>()((set, get) => ({
  logs: [],
  connected: false,
  connecting: false,
  connect: () => {
    if (get().connecting) {
      get().disconnect();
      window.client.disconnect();
      return;
    }
    set({ connecting: true });
    window.client.connect(
      useSettings.getState().getSettings(),
      (_, connected) => {
        if (connected) {
          set({ connected: true, connecting: false });
          window.client.logs((_, data) => {
            set({ logs: [...get().logs, data] });
          });
        } else {
          set({ connected: false, connecting: false });
        }
      }
    );
  },
  disconnect: () => {
    set({ logs: [], connected: false, connecting: false });
    window.client.disconnect();
  },
}));
