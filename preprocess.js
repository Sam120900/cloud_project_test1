// The code from "Data Preprocessing" goes here
const fs = require("fs");
const Papa = require("papaparse");

async function preprocessFile(filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createReadStream(filePath);

    let data = [];
    Papa.parse(file, {
      header: true,
      step: function (result) {
        const row = result.data;
        if (Object.keys(row).length > 4) {
          reject(new Error("Data has more than 4 dimensions."));
          return;
        }
        data.push(row);
      },
      complete: function () {
        // Further preprocessing if necessary
        resolve(data);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

module.exports = preprocessFile;
