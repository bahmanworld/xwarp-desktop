import { create } from "zustand";

type LogsProps = {
  data: string[];
  update: (data: string[]) => void;
  clear: () => void;
};

export const useLogs = create<LogsProps>()((set, get) => ({
  data: [],
  update: (data) => {
    set({ data });
  },
  clear: () => {
    set({ data: [] });
  },
}));
