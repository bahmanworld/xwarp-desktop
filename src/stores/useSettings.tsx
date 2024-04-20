import { create } from "zustand";
import { useWarp } from "./useWarp";
import { PersistStorage, persist } from "zustand/middleware";

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
  updateField: (key: keyof Fields, value: typeof key | any) => void;
  getSettings: () => Fields;
  resetSettings: () => void;
}

export const useSettings = create<ISettings>()((set, get) => ({
  endpoint: window.client.settings.get("endpoint") || "",
  key: window.client.settings.get("key") || "",
  port: window.client.settings.get("port") || 8086,
  psiphon: window.client.settings.get("psiphon") || false,
  counrty: window.client.settings.get("country") || "US",
  gool: window.client.settings.get("gool") || false,
  updateField: (key, value) => {
    set({ [key]: value });
    window.client.settings.set(key, value);
    setTimeout(() => {
      set({ ...get() });
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
    window.client.settings.clear();
    set({
      endpoint: "",
      key: "",
      port: 8086,
      psiphon: false,
      counrty: "US",
      gool: false,
    });
  },
}));
