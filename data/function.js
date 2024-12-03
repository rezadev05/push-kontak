const fs = require("fs");
const chalk = require("chalk");
const crypto = require("node:crypto");
const moment = require("moment-timezone");

function hitung_estimasi_waktu(hitung, interval) {
  const estimasi_waktu = Math.floor((hitung * interval) / 1000);
  const estimais_menit = Math.floor(estimasi_waktu / 60); // Menit
  const estimasi_detik = estimasi_waktu % 60; // Detik

  return {
    menit: estimais_menit,
    detik: estimasi_detik,
  };
}

function interval() {
  let interval_array = [];

  try {
    interval_array = JSON.parse(fs.readFileSync("./data/interval.json"));
  } catch (error) {
    interval_array.error(error);
  }

  return interval_array.map((item) => item.interval);
}

const get_group_admin = (participants) => {
  let admin = [];
  for (let i of participants) {
    i.admin === "superadmin"
      ? admin.push(i.id)
      : i.admin === "admin"
      ? admin.push(i.id)
      : "";
  }
  return admin || [];
};

const create_serial = (size) => {
  return crypto.randomBytes(size).toString("hex").slice(0, size);
};

const color = (text, color) => {
  return !color ? chalk.green(text) : chalk.keyword(color)(text);
};

const pasrse_mention = (text = "") => {
  return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
    (v) => v[1] + "@s.whatsapp.net"
  );
};

let dt = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("a");
const ucapan_waktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1);

const runtime = function (seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

module.exports = {
  interval,
  get_group_admin,
  create_serial,
  color,
  pasrse_mention,
  ucapan_waktu,
  runtime,
  hitung_estimasi_waktu,
};
