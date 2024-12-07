/**
 * JANGAN MENGHASPUS KOMENTAR INI
 * SERTAKAN PENGEMBANG DALAM PUBLIKASI APAPUN
 * DONASI UNTUK APRESIASI PENGEMBANG
 * TERIMKASIH SEMOGA BERMANFAAT
 */

const fs = require("fs");
const chalk = require("chalk");

global.owner = ["6282264914210"];
global.author = "https://github.com/rezadev05";
global.packname = "push-kontak";
global.sessionName = "WhatsApp-Session";
global.versionbot = "24.12.01";
global.mess = {
  wait: "Loading...",
  success: "Operation Sucessfull!",
  owner: "Fitur Khusus Owner Bot",
  waitdata: "Melihat Data Terkini...",
  admin: "Fitur Khusus Admin Group!",
  private: "Fitur Khusus Private Chat!",
  group: "Fitur Digunakan Hanya Untuk Group!",
  botAdmin: "Bot Harus Menjadi Admin Terlebih Dahulu!",
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
