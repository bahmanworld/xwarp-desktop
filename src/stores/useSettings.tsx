import { create } from "zustand";

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
}

export const useSettings = create<ISettings>()((set, get) => ({
  endpoint: "engage.cloudflareclient.com:2408",
  key: "",
  port: 8086,
  psiphon: false,
  counrty: "US",
  gool: false,
  updateField: (key, value) => {
    set({ ...get(), [key]: value });
  },
}));
