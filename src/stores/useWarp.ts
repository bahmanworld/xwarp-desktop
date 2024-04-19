import { create } from "zustand";
import { useSettings } from "./useSettings";

type WarpProps = {
  connected: boolean;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
};

export const useWarp = create<WarpProps>()((set, get) => ({
  connected: false,
  connecting: false,
  connect: async () => {
    if (get().connecting) return;
    set({ connecting: true });
    window.client.connect(useSettings.getState().getSettings());
    setTimeout(() => {
      set({ connected: true, connecting: false });
    }, 2000);
  },
  disconnect: () => {
    set({ connected: false, connecting: false });
    return;
  },
}));
