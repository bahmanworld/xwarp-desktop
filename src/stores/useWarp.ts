import { create } from "zustand";
import { useSettings } from "./useSettings";
import axios from "axios";

export const IFConfigCountryFlag = [
  { id: "AT", flag: "🇦🇹" },
  { id: "BE", flag: "🇧🇪" },
  { id: "BG", flag: "🇧🇬" },
  { id: "BR", flag: "🇧🇷" },
  { id: "CA", flag: "🇨🇦" },
  { id: "CH", flag: "🇨🇳" },
  { id: "CZ", flag: "🇨🇿" },
  { id: "DE", flag: "🇩🇪" },
  { id: "DK", flag: "🇩🇰" },
  { id: "EE", flag: "🇪🇪" },
  { id: "ES", flag: "🇪🇸" },
  { id: "FI", flag: "🇫🇮" },
  { id: "FR", flag: "🇫🇷" },
  { id: "GB", flag: "🇬🇧" },
  { id: "HU", flag: "🇭🇺" },
  { id: "IR", flag: "🇮🇷" },
  { id: "IE", flag: "🇮🇪" },
  { id: "IN", flag: "🇮🇳" },
  { id: "IT", flag: "🇮🇹" },
  { id: "JP", flag: "🇯🇵" },
  { id: "LV", flag: "🇱🇻" },
  { id: "NL", flag: "🇳🇱" },
  { id: "NO", flag: "🇳🇴" },
  { id: "PL", flag: "🇵🇱" },
  { id: "RO", flag: "🇷🇴" },
  { id: "RS", flag: "🇷🇸" },
  { id: "SE", flag: "🇸🇪" },
  { id: "SG", flag: "🇸🇬" },
  { id: "SK", flag: "🇸🇰" },
  { id: "UA", flag: "🇺🇦" },
  { id: "US", flag: "🇺🇸" },
];

type WarpProps = {
  log: string;
  connected: boolean;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
  clearLogs: () => void;
  ifconfig?: any | null;
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
