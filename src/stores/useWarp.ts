import { create } from "zustand";
import { useSettings } from "./useSettings";
import axios from "axios";


type IFConfig = {
  ip?: string
  country?: string,
  country_iso?: string
}

type WarpProps = {
  log: string;
  connected: boolean;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
  clearLogs: () => void;
  ifconfig?: IFConfig | null;
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
          axios.get("https://ifconfig.co/json").then((res) => {
            set({ ifconfig: res.data });
          });
        } else {
          set({ connected: false, connecting: false });
        }
      }
    );
  },
  disconnect: () => {
    set({ log: "", connected: false, connecting: false, ifconfig: null });
    window.electron.disconnect();
  },
  clearLogs: () => {
    set({ log: "" });
  },
  ifconfig: null,
}));
