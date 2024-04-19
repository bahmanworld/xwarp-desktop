import { create } from "zustand";
import { useWarp } from "./useWarp";
import { persist } from "zustand/middleware";

export const Countries = [
  { id: "AT", name: "Austria" },
  { id: "BE", name: "Belgium" },
  { id: "BG", name: "Bulgaria" },
  { id: "BR", name: "Brazil" },
  { id: "CA", name: "Canada" },
  { id: "CH", name: "China" },
  { id: "CZ", name: "Czechia" },
  { id: "DE", name: "Germany" },
  { id: "DK", name: "Denmark" },
  { id: "EE", name: "Estonia" },
  { id: "ES", name: "Spain" },
  { id: "FI", name: "Finland" },
  { id: "FR", name: "France" },
  { id: "GB", name: "United Kingdom" },
  { id: "HU", name: "Hungary" },
  { id: "IE", name: "Ireland" },
  { id: "IN", name: "India" },
  { id: "IT", name: "Italy" },
  { id: "JP", name: "Japan" },
  { id: "LV", name: "Latvia" },
  { id: "NL", name: "Netherlands" },
  { id: "NO", name: "Norway" },
  { id: "PL", name: "Poland" },
  { id: "RO", name: "Romania" },
  { id: "RS", name: "Serbia" },
  { id: "SE", name: "Sweden" },
  { id: "SG", name: "Singapore" },
  { id: "SK", name: "Slovakia" },
  { id: "UA", name: "Ukraine" },
  { id: "US", name: "United States" },
];

type Fields = {
  endpoint: string;
  key: string;
  port: number;
  psiphon: boolean;
  counrty: string;
  gool: boolean;
};

interface ISettings extends Fields {
  saving: boolean;
  updateField: (key: keyof Fields, value: typeof key | any) => void;
  getSettings: () => Fields;
  resetSettings: () => void;
}

export const useSettings = create<ISettings>()(
  persist(
    (set, get) => ({
      endpoint: "",
      key: "",
      port: 8086,
      psiphon: false,
      counrty: "US",
      gool: false,
      saving: false,
      updateField: (key, value) => {
        set({ ...get(), [key]: value, saving: true });
        setTimeout(() => {
          set({ ...get(), saving: false });
          useWarp.getState().disconnect();
          window.client.disconnect();
        }, 100);
      },
      getSettings: () => {
        return {
          endpoint: get().endpoint,
          key: get().key,
          port: get().port,
          psiphon: get().psiphon,
          counrty: get().counrty,
          gool: get().gool,
        };
      },
      resetSettings: () => {
        set({
          endpoint: "",
          key: "",
          port: 8086,
          psiphon: false,
          counrty: "US",
          gool: false,
        });
      },
    }),
    {
      name: "settings",
      // storage: ElectronStorage,
    }
  )
);
