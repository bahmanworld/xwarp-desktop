import ElectronStore from "electron-store";

const storage = new ElectronStore();

export class Storage {
  static instance = new Storage();

  set = (key: string, value: unknown) => {
    storage?.set(key, value);
  };

  get = (key: string) => {
    return storage?.get(key);
  };

  delete = (key: string) => {
    storage?.delete(key);
  };

  clear = () => {
    storage?.clear();
  };
}
