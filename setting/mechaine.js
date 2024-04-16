/**
 * Source Code By Reza
 * Don't Forget Smile
 * Thank You :)
 */

const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const crypto = require("crypto");
const { getDelay } = require("../data/function");

const getGroupAdmins = (participants) => {
  let admins = [];
  for (let i of participants) {
    i.admin === "superadmin"
      ? admins.push(i.id)
      : i.admin === "admin"
      ? admins.push(i.id)
      : "";
  }
  return admins || [];
};

const contacts = JSON.parse(fs.readFileSync("./data/kontak.json"));

const createSerial = (size) => {
  return crypto.randomBytes(size).toString("hex").slice(0, size);
};

require("./config");
module.exports = rezadevv = async (client, m, chatUpdate, store) => {
  try {
    var body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype == "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype == "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : m.mtype == "buttonsResponseMessage"
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype == "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype == "templateButtonReplyMessage"
        ? m.message.templateButtonReplyMessage.selectedId
        : m.mtype === "messageContextInfo"
        ? m.message.buttonsResponseMessage?.selectedButtonId ||
          m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
          m.text
        : "";
    var budy = typeof m.text == "string" ? m.text : "";
    // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
    var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
    const isCmd2 = body.startsWith(prefix);
    const command = body
      .replace(prefix, "")
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();
    const botNumber = await client.decodeJid(client.user.id);
    const isCreator = [botNumber, ...global.owner]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const itsMe = m.sender == botNumber ? true : false;
    let text = (q = args.join(" "));
    const fatkuns = m.quoted || m;
    const quoted =
      fatkuns.mtype == "buttonsMessage"
        ? fatkuns[Object.keys(fatkuns)[1]]
        : fatkuns.mtype == "templateMessage"
        ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]]
        : fatkuns.mtype == "product"
        ? fatkuns[Object.keys(fatkuns)[0]]
        : m.quoted
        ? m.quoted
        : m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const qmsg = quoted.msg || quoted;
    const arg = budy.trim().substring(budy.indexOf(" ") + 1);
    const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

    const from = m.chat;
    const reply = m.reply;
    const sender = m.sender;
    const mek = chatUpdate.messages[0];
    const isContacts = contacts.includes(sender);

    const color = (text, color) => {
      return !color ? chalk.green(text) : chalk.keyword(color)(text);
    };

    // Group
    const groupMetadata = m.isGroup
      ? await client.groupMetadata(m.chat).catch((e) => {})
      : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";
    const participants = m.isGroup ? await groupMetadata.participants : "";
    const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : "";
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;

    // Push Message To Console
    let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;

    if (isCmd2 && !m.isGroup) {
      console.log(
        chalk.black(chalk.bgWhite("[ PESAN ]")),
        color(argsLog, "turquoise"),
        chalk.magenta("From"),
        chalk.green(pushname),
        chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`)
      );
    } else if (isCmd2 && m.isGroup) {
      console.log(
        chalk.black(chalk.bgWhite("[ PESAN ]")),
        color(argsLog, "turquoise"),
        chalk.magenta("From"),
        chalk.green(pushname),
        chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
        chalk.blueBright("IN"),
        chalk.green(groupName)
      );
    }

    if (isCmd2) {
      switch (command) {
        case "menu":
        case "help":
          {
            const reactionMessage = {
              react: {
                text: "🕓",
                key: m.key,
              },
            };
            await client.sendMessage(sender, reactionMessage);
            text = `╭──❒ *All MENU BOT*\n├• 📌 ${prefix}pushkontak [text]\n├• 📌 ${prefix}pushid [idgroup|text]\n├• 📌 ${prefix}pushimg [idgroup|caption]\n├• 📌 ${prefix}savekontak [idgroup]\n├• 📌 ${prefix}getidgc\n├• 📌 ${prefix}delayconf\n└────────────>`;
            client.sendText(from, text, m);
          }
          break;
        case "setdelay":
        case "delayconf":
          {
            if (command === "delayconf") {
              reply(
                `Delay: [ ${getDelay()} ms ]\n\n_Sangat direkomendasikan menggunakan kecepatan *10000 ms* biar lambat asal selamat😊._`
              );
            } else {
              if (!isCreator) return m.reply(mess.owner);
              if (!text)
                return m.reply(
                  `Example ${
                    prefix + command
                  } 10000\n\n*_Rekomendasi Menggunakan Kecepatan 10000 (untuk 10 detik)!. Agar Terhindar Dari Suspend Pihak WhatsApp._*`
                );
              if (text < 10000) return m.reply("Setdelay minimum 10000!");
              if (isNaN(text) || text <= 0) {
                m.reply(
                  "```Nilai delay tidak valid atau kurang dari sama dengan 0!```"
                );
              } else {
                let delayObject = { delay: text };
                let delayArray = [];

                try {
                  delayArray = JSON.parse(fs.readFileSync("./data/delay.json"));
                } catch (error) {
                  console.error(`Terjadi Kesalahan: ${error}`);
                }

                const existingIndex = delayArray.findIndex(
                  (item) => item.delay
                );

                if (existingIndex !== -1) {
                  delayArray[existingIndex].delay = text;
                } else {
                  delayArray.push(delayObject);
                }

                fs.writeFileSync(
                  "./data/delay.json",
                  JSON.stringify(delayArray, null, 2)
                );
                m.reply(`*_Sukses Setting Delay ${text}_*`);
              }
            }
          }
          break;
        case "pushkontak":
          {
            if (!text) return m.reply(`Example ${prefix}${command} Hello`);
            if (!isCreator) return m.reply(mess.owner);
            if (!m.isGroup) return m.reply(mess.group);
            if (!isBotAdmins) return m.reply(mess.botAdmin);
            if (!isAdmins) throw m.reply(mess.admin);
            let get = await participants
              .filter((v) => v.id.endsWith(".net"))
              .map((v) => v.id);
            let count = get.length;
            let sentCount = 0;
            m.reply("*_Sedang Push Kontak..._*");
            for (let i = 0; i < get.length; i++) {
              setTimeout(function () {
                client.sendMessage(get[i], { text: text });
                count--;
                sentCount++;
                if (count === 0) {
                  m.reply(
                    `*_Berhasil Push Kontak:_*\n*_Jumlah Pesan Terkirim: ${sentCount}_*`
                  );
                }
              }, i * getDelay());
            }
          }
          break;
        case "pushimg":
          {
            if (!isCreator) return m.reply(mess.owner);
            let idgc = text.split("|")[0];
            let caption = text.split("|")[1];
            if (!idgc && !caption)
              return m.reply(`Example: ${prefix + command} idgc|pesan`);
            if (/image/.test(mime)) {
              let media = await quoted.download();
              let metaDATA = await client.groupMetadata(idgc).catch((e) => {
                m.reply(e);
              });
              let getDATA = await metaDATA.participants
                .filter((v) => v.id.endsWith(".net"))
                .map((v) => v.id);
              let count = getDATA.length;
              let sentCount = 0;
              const reactionMessage = {
                react: {
                  text: "🕓", // use an empty string to remove the reaction
                  key: m.key,
                },
              };
              await client.sendMessage(sender, reactionMessage);
              m.reply("*_Sedang Push Img..._*");
              for (let i = 0; i < getDATA.length; i++) {
                setTimeout(function () {
                  client.sendImage(getDATA[i], media, caption);
                  count--;
                  sentCount++;
                  if (count === 0) {
                    const reactionMessage = {
                      react: {
                        text: "✅", // use an empty string to remove the reaction
                        key: m.key,
                      },
                    };
                    client.sendMessage(sender, reactionMessage);
                    m.reply(
                      `*_Semua pesan telah dikirim!_*:\n*_Jumlah pesan terkirim:_* *_${sentCount}_*`
                    );
                  }
                }, i * getDelay());
              }
            } else {
              m.reply(
                `Reply gambar dengan caption ${prefix}pushimg idgc|caption`
              );
            }
          }
          break;
        case "pushid":
          {
            if (!isCreator) return m.reply(mess.owner);
            let idgc = text.split("|")[0];
            let pesan = text.split("|")[1];
            if (!idgc && !pesan)
              return m.reply(`Example: ${prefix + command} idgc|pesan`);
            let metaDATA = await client.groupMetadata(idgc).catch((e) => {
              m.reply(e);
            });
            let getDATA = await metaDATA.participants
              .filter((v) => v.id.endsWith(".net"))
              .map((v) => v.id);
            let count = getDATA.length;
            let sentCount = 0;
            m.reply("*_Sedang Push ID..._*");
            for (let i = 0; i < getDATA.length; i++) {
              setTimeout(function () {
                client.sendMessage(getDATA[i], { text: pesan });
                count--;
                sentCount++;
                if (count === 0) {
                  m.reply(
                    `*_Semua pesan telah dikirim!_*:\n*_Jumlah pesan terkirim:_* *_${sentCount}_*`
                  );
                }
              }, i * getDelay());
            }
          }
          break;
        case "savekontak":
          {
            if (!isCreator) return m.reply(mess.owner);
            if (m.isGroup) return reply(mess.private);
            if (!text) return reply(`Exampale: ${prefix + command} idgroup`);
            const groupMetadataa = !m.isGroup
              ? await client.groupMetadata(`${text}`).catch((e) => {
                  reply(e);
                })
              : "";
            const participants = !m.isGroup
              ? await groupMetadataa.participants
              : "";
            const getdata = await participants
              .filter((v) => v.id.endsWith(".net"))
              .map((v) => v.id);
            reply(mess.wait);
            for (let member of getdata) {
              if (isContacts) return;
              contacts.push(member);
              fs.writeFileSync("./data/kontak.json", JSON.stringify(contacts));
            }
            try {
              const uniqueContacts = [...new Set(contacts)];
              const vcardContent = uniqueContacts
                .map((contact) => {
                  const vcard = [
                    "BEGIN:VCARD",
                    "VERSION:3.0",
                    `FN:WA[${createSerial(2)}] ${contact.split("@")[0]}`,
                    `TEL;type=CELL;type=VOICE;waid=${contact.split("@")[0]}:+${
                      contact.split("@")[0]
                    }`,
                    "END:VCARD",
                    "",
                  ].join("\n");
                  return vcard;
                })
                .join("");
              fs.writeFileSync("./data/kontak.vcf", vcardContent, "utf8");
            } catch (err) {
              reply(util.format(err));
            } finally {
              await client.sendMessage(
                from,
                {
                  document: fs.readFileSync("./data/kontak.vcf"),
                  fileName: "contacts.vcf",
                  caption: `_*${mess.success}*_\n\n_Group:_ *_${groupMetadataa.subject}_*`,
                  mimetype: "text/vcard",
                },
                { quoted: m }
              );
              fs.writeFileSync("./data/kontak.vcf", "");
              contacts.splice(0, contacts.length);
              fs.writeFileSync("./data/kontak.json", JSON.stringify(contacts));
            }
          }
          break;
        case "getidgc":
          {
            if (!isCreator) return reply(mess.owner);
            if (!m.isGroup) return reply(mess.group);
            reply(from);
          }
          break;
        default: {
          if (isCmd2 && budy.toLowerCase() != undefined) {
            if (m.chat.endsWith("broadcast")) return;
            if (m.isBaileys) return;
            if (!budy.toLowerCase()) return;
            if (argsLog || (isCmd2 && !m.isGroup)) {
              // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
              console.log(
                chalk.black(chalk.bgRed("[ ERROR ]")),
                color("command", "turquoise"),
                color(`${prefix}${command}`, "turquoise"),
                color("tidak tersedia", "turquoise")
              );
            } else if (argsLog || (isCmd2 && m.isGroup)) {
              // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
              console.log(
                chalk.black(chalk.bgRed("[ ERROR ]")),
                color("command", "turquoise"),
                color(`${prefix}${command}`, "turquoise"),
                color("tidak tersedia", "turquoise")
              );
            }
          }
        }
      }
    }
  } catch (err) {
    m.reply(util.format(err));
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
