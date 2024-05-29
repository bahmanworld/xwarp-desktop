import { create } from "zustand";

export const Countries = [
  { id: "AT", name: "Austria" },
  { id: "BE", name: "Belgium" },
  { id: "BG", name: "Bulgaria" },
  { id: "BR", name: "Brazil" },
  { id: "CA", name: "Canada" },
  { id: "CH", name: "China" },
  { id: "CZ", name: "Czech Republic" },
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
  port: string;
  psiphon: boolean;
  country: string;
  gool: boolean;
  tun: boolean;
};

interface ISettings extends Fields {
  stayOnTop: boolean;
  updateStayOnTop: (stay: boolean) => void;
  updateField: (key: keyof Fields, value: typeof key | any) => void;
  getSettings: () => Fields;
  resetSettings: () => void;
}

export const useSettings = create<ISettings>()((set, get) => ({
  endpoint: window.electron.settings.get("endpoint") || "",
  key: window.electron.settings.get("key") || "",
  port: window.electron.settings.get("port") || "",
  psiphon: window.electron.settings.get("psiphon") || false,
  country: window.electron.settings.get("country") || "US",
  gool: window.electron.settings.get("gool") || false,
  tun: window.electron.settings.get("tun") || false,
  stayOnTop: false,
  updateStayOnTop: (stay) => {
    set({ stayOnTop: stay });
  },
  updateField: (key, value) => {
    set({ [key]: value });
    window.electron.settings.set(key, value);
    setTimeout(() => {
      set({ ...get() });
      window.electron.disconnect();
    }, 100);
  },
  getSettings: () => {
    return {
      endpoint: get().endpoint,
      key: get().key,
      port: get().port,
      psiphon: get().psiphon,
      country: get().country,
      gool: get().gool,
      tun: get().tun,
    };
  },
  resetSettings: () => {
    window.electron.settings.clear();
    set({
      endpoint: "",
      key: "",
      port: "",
      psiphon: false,
      country: "US",
      gool: false,
    });
  },
}));
