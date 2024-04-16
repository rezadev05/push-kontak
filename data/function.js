const fs = require("fs");

function getDelay() {
  let delayArray = [];

  try {
    delayArray = JSON.parse(fs.readFileSync("./data/delay.json"));
  } catch (error) {
    console.error(`Terjadi Kesalahan: ${error}`);
  }

  return delayArray.map((item) => item.delay);
}

module.exports = { getDelay };
