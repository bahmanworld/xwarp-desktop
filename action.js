const zlip = require("zlib");
const fs = require("fs");
const path = require("path");
const process = require("process");
const minimist = require("minimist")(process.argv);
const Downloader = require("nodejs-file-downloader");
const AdmZip = require("adm-zip");
const json = require("./package.json");

const args = {
  filename: minimist.filename,
};

const repo = json.warp_plus_repo; // warp-plus repository
const version = json.warp_plus_version; // warp-plus version
const filename = args.filename; // warp-plus filename to download based on OS Arch
const url = `${repo}/releases/download/${version}/${filename}`;

const runAction = async () => {
  try {
    console.log(`${filename} is downloading, please wait...`);
    const downloader = new Downloader({
      url: url,
      directory: "./",
      fileName: "warp-plus.zip",
    });
    const download = await downloader.download();
    const downloadedFile = download.filePath;
    console.log(
      `${path.basename(downloadedFile)} is extracting, please wait...`
    );
    const zip = new AdmZip(downloadedFile);
    zip.extractAllTo("public/bin", true, true);
  } catch (e) {
    console.error(e);
    return;
  }
};

runAction();
