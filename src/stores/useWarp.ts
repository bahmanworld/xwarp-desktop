import { create } from "zustand";
import { useSettings } from "./useSettings";

type WarpProps = {
  logs: any;
  connected: boolean;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
};

export const useWarp = create<WarpProps>()((set, get) => ({
  logs: null,
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
          // window.client.logs((data) => {
          //   set({ logs: data });
          // });
        } else {
          set({ connected: false, connecting: false });
        }
      }
    );
  },
  disconnect: () => {
    set({ logs: null, connected: false, connecting: false });
    window.client.disconnect();
  },
}));
