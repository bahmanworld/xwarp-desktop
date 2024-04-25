import { create } from "zustand";

type LogsProps = {
  data: string[];
  update: (data: string[]) => void;
  clear: () => void;
};

export const useLogs = create<LogsProps>()((set, get) => ({
  data: window.electron.settings.get("logs") || [],
  update: (data) => {
    set({ data });
    window.electron.settings.set("logs", data);
  },
  clear: () => {
    set({ data: [] });
    window.electron.settings.set("logs", []);
  },
}));
