const youtubedl = require("youtube-dl");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const request = require("request");
const { loggers } = require("./logger");
const readLine = require("readline");

exports.downloadImage = (filePath, url) => {
  loggers("filePath", filePath)
  loggers("url", url)
  return new Promise((resolve, reject) => {
    let filename;
    let mimetype;
    let fileSize;
    let originalname = url? url.split("/").pop():null;
    const serverId = crypto
        .createHash("md5")
        .update(String(Math.random()))
        .digest("hex");

    request
        .get(url)
        .on("response", function(response) {
          mimetype = response.headers["content-type"];
          filename = extractFileName(response.headers) || serverId;
          fileSize = response.headers["Content-Length"];
          fileSize = fileSize ? Number(fileSize):Number(response.headers["content-length"]);


          loggers("response", response)
          loggers("mimetype", mimetype)
          loggers("filename", filename)
          loggers("fileSize", fileSize)

        })
        .on("end", function() {
          resolve({
            serverId,
            filename,
            size:fileSize,
            mimetype,
            path : filePath + "/"+ serverId,
            originalname
          });
        })
        .on("error", reject)
        .pipe(fs.createWriteStream(path.join(filePath, serverId)))
        .on("error", reject);
  });
};

exports.downloadVideo = (filePath, url) => {
  loggers("filepath", filePath)
  return new Promise((resolve, reject) => {
    const video = youtubedl(url, ["--no-playlist","--format=18"]);

    let filename;
    let fileSize;
    const serverId = crypto
        .createHash("md5")
        .update(String(Math.random()))
        .digest("hex");

    video.on("info", function(info) {
      console.log("Download started");
      console.log("filename: " + info._filename);
      console.log("size: " + info.size);
      filename = info._filename;
      fileSize = info.size;
    });
    video.on("error", reject);
    let pos = 0;
    video.on('data', function data(chunk) {
      pos += chunk.length
      // `size` should not be 0 here.
      if (fileSize) {
        let percent = (pos / fileSize * 100).toFixed(2);
        console.log(percent + '%')
      }
    })
    
    video.on("end", () =>{
    console.log("download ended")
      return resolve({
        serverId,
        filename,
        size : fileSize,
        mimetype: "video/mp4",
        originalname : filename,
        path : filePath + "/"+ serverId,
      })
    }
    );
    video.pipe(fs.createWriteStream(path.join(filePath, serverId)))
    
  });
};

function extractFileName(headers) {
  const fileNameRegex = /filename="?(\w+)"?/;
  const match = fileNameRegex.exec(headers["Content-Disposition"]);
  return match && match[1];
}
