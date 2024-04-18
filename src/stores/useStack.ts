import { Panel } from "@blueprintjs/core";
import { create } from "zustand";

type StackProps = {
  stacks: Panel<object>[];
  push: (stack: Panel<object>) => void;
  pop: () => void;
};

export const usePanelStack = create<StackProps>()((set, get) => ({
  stacks: [],
  push: (panel) => {
    const stacks = [...get().stacks];
    stacks.push(panel);
    set({ stacks });
  },
  pop: () => {
    const stacks = [...get().stacks];
    stacks.pop();
    set({ stacks });
  },
}));
