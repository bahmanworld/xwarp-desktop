import { app } from "electron";
import { createWriteStream } from "fs";
import path from "path";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import fs from 'fs'

export const download = async (url: string) => {
  let result: Promise<void> | null = null;
  const fileName = url.split("/").pop();
  const resp = await fetch(url);
  if (resp.ok && resp.body) {
    console.log("Writing to file:", fileName);
    let writer = createWriteStream(
      path.join(app.getAppPath(), 'warp-plus.zip')
    );
    result = finished(Readable.fromWeb(resp.body as any).pipe(writer));
  }
  return result;
};


export const setReadAndWritePermissions = (path: string) => {
  let mode = fs.statSync(path).mode;
  let newMode = mode | 0o222;
  fs.chmodSync(path, newMode);
}