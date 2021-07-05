const express = require("express");
const router = express.Router();
//Swaroop
router.get("/media", (req, res, next) => {
    const path = require("path");
    const fs = require("fs");
    //joining path of directory
    const directoryPath = path.join(
        __dirname.replace("routes", "private/data"),
        "media"
    );
    //passing directoryPath and callback function
    var files = "";
    const promises = [];
    fs.readdirSync(directoryPath).forEach((file) => {
        files += file + ",";
    });
    files = files.substring(0, files.length - 1).split(",");

    for (i = 0; i < files.length; i++) {
        promises.push(getMetaData(directoryPath, files[i]));
    }
    const media = [];
    Promise.all(promises)
        .then((results) => {
            for (j = 0; j < results.length; j++) {
                media.push(results[j]);
            }
            res.json(media);
        })
        .catch((e) => {
            media.push({
                _id: null,
                metaData: e.message,
                src: e,
                error: true,
                diagnostic: e,
            });
            res.json(media);
        });
});

function getAutoID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

//Get Metadata
function getMetaData(path, fName) {
    const ffmetadata = require("ffmetadata");

    return new Promise((resolve) => {
        setTimeout(() => {
            ffmetadata.read(path + "/" + fName, function(err, data) {
                if (err) console.error("Error reading metadata", err);
                else {
                    resolve({
                        _id: getAutoID(),
                        src: fName,
                        title: data.title,
                        artist: data.artist,
                        metadata: data,
                    });
                }
            });
        }, 1000);
    });
}

module.exports = router;