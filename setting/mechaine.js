/**
 * JANGAN MENGHASPUS KOMENTAR INI
 * SERTAKAN PENGEMBANG DALAM PUBLIKASI APAPUN
 * DONASI UNTUK APRESIASI PENGEMBANG
 * TERIMKASIH SEMOGA BERMANFAAT
 */

require("./config");

const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const moment = require("moment-timezone");
const {
  interval,
  get_group_admin,
  color,
  pasrse_mention,
  ucapan_waktu,
  runtime,
  create_serial,
  hitung_estimasi_waktu,
} = require("../data/function");

const kontak = JSON.parse(fs.readFileSync("./data/kontak.json"));
const signup = JSON.parse(fs.readFileSync("./data/user.json"));

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

    var body_type = typeof m.text == "string" ? m.text : "";

    // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
    // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
    var prefix = /^#/gi.test(body) ? "#" : "/";

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
    const pushname = m.pushName || "Unknown!?";
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
    const arg = body_type.trim().substring(body_type.indexOf(" ") + 1);
    const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

    const from = m.chat;
    const reply = m.reply;
    const sender = m.sender;
    const mek = chatUpdate.messages[0];
    const isContacts = kontak.includes(sender);
    const isUser = signup.includes(sender);

    //GROUP
    const groupMetadata = m.isGroup
      ? await client.groupMetadata(m.chat).catch((e) => {})
      : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";
    const participants = m.isGroup ? await groupMetadata.participants : "";
    const groupAdmins = m.isGroup ? await get_group_admin(participants) : "";
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;

    //TAMPILKAN PESAN KE CONSOLE
    const argsLog =
      body_type.length > 30 ? `${q.substring(0, 30)}...` : body_type;

    if (isCmd2 && !isUser) {
      signup.push(sender);
      fs.writeFileSync("./data/user.json", JSON.stringify(signup, null, 2));
    }

    if (isCmd2 && !m.isGroup) {
      console.log(
        chalk.black(chalk.bgWhite("[ PESAN ]")),
        color(`${argsLog} |`, "turquoise"),
        chalk.magenta("FROM |"),
        chalk.green(`${pushname} |`),
        chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`)
      );
    } else if (isCmd2 && m.isGroup) {
      console.log(
        chalk.black(chalk.bgWhite("[ PESAN ]")),
        color(`${argsLog} |`, "turquoise"),
        chalk.magenta("FROM |"),
        chalk.green(`${pushname} |`),
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
            await client.sendMessage(sender, {
              react: {
                text: "🕓",
                key: m.key,
              },
            });
            text = `
Hi, ${pushname} ${ucapan_waktu}👋

╭─❒ 「 INFORMASI BOT 」 
├ _Author : ${author}_
├ _Packname : ${packname}_
├ _Runtime : ${runtime(process.uptime())}_
├ _Pengguna : ${signup.length}_
╰❒

╭──❒ *SEMUA MENU BOT*
│
├• *[ PUSH KONTAK ]*
├• 📌 ${prefix}pushkontak [text]
├• 📌 ${prefix}pushid [idgroup|text]
├• 📌 ${prefix}pushimg [idgroup|caption]
├• 📌 ${prefix}savekontak [idgroup]
│
├• *[ GROUP ]*
├• 📌 ${prefix}inspeksi [link group]
├• 📌 ${prefix}listgroup
├• 📌 ${prefix}getidgroup
│
├• *[ KONFIGURASI ]*
├• 📌 ${prefix}setinterval [interval]
├• 📌 ${prefix}cekinterval
└────────────>`;
            client.sendText(from, text, m);
          }
          break;
        case "setinterval":
        case "cekinterval":
          {
            if (command === "cekinterval") {
              reply(
                `Interval ~ [ ${interval()} ms ]\n\nGunakan interval 10000 ms (direkomendasikan) untuk meminimalisir banned oleh WhatsApp❗`
              );
            } else if (command === "setinterval") {
              if (!isCreator) return m.reply(mess.owner);
              if (!text) return m.reply(`Contoh ${prefix + command} 10000`);
              if (text < 10000)
                return m.reply("Interval minimum adalah 10000❗");
              if (isNaN(text) || text <= 0) {
                m.reply("Nilai interval tidak valid :(");
              } else {
                let interval_object = { interval: text };
                let interval_array = [];

                try {
                  interval_array = JSON.parse(
                    fs.readFileSync("./data/delay.json")
                  );
                } catch (error) {
                  console.error(error);
                }

                const index_ada = interval_array.findIndex(
                  (item) => item.delay
                );

                if (index_ada !== -1) {
                  interval_array[index_ada].delay = text;
                } else {
                  interval_array.push(interval_object);
                }

                fs.writeFileSync(
                  "./data/interval.json",
                  JSON.stringify(interval_array, null, 2)
                );
                m.reply(`Sukses set interval ~ [ ${text} ms ]`);
              }
            }
          }
          break;
        case "listgroup":
          {
            if (!isCreator) return m.reply(mess.owner);
            try {
              //MENGAMBIL SEMUA GROUP
              const groups = await client.groupFetchAllParticipating();
              const groupList = Object.values(groups).map((group) => ({
                id: group.id,
                subject: group.subject,
                memberCount: group.participants.length,
              }));

              //FORMAT HASIL MENJADI STRING
              if (groupList.length === 0) {
                return m.reply("Tidak ditemukan group apapun :(");
              }

              let groupInfo = "「 DAFTAR SELURUH GRUP 」\n";
              groupList.forEach((group, index) => {
                groupInfo += `
✨ Nama Group : ${group.subject}
🪪 ID Group : ${group.id}
👥 Total Member : ${group.memberCount}\n`;
              });

              m.reply(groupInfo);
            } catch (err) {
              m.reply(`Terjadi kesalahan: ${err.message}`);
            }
          }
          break;
        case "inspeksi":
          {
            if (!isCreator) return m.reply(mess.owner);
            if (!args[0]) return m.reply("```Link Not Found```");
            let linknya = args.join(" ");
            let url_obj = linknya.split("https://chat.whatsapp.com/")[1];
            if (!url_obj) return m.reply("```Link Invalid```");
            m.reply("Sedang mengecek link...");
            client
              .query({
                tag: "iq",
                attrs: {
                  type: "get",
                  xmlns: "w:g2",
                  to: "@g.us",
                },
                content: [{ tag: "invite", attrs: { code: url_obj } }],
              })
              .then(async (res) => {
                teks = `「 Group Link Inspected 」\n\n▸ _Group Name_ : *_${
                  res.content[0].attrs.subject
                    ? res.content[0].attrs.subject
                    : "undefined"
                }_*\n▸ _Desc Change_ : *_${
                  res.content[0].attrs.s_t
                    ? moment(res.content[0].attrs.s_t * 1000)
                        .tz("Asia/Jakarta")
                        .format("DD-MM-YYYY, HH:mm:ss")
                    : "undefined"
                }_*\n▸ _Group Creator_ : *_${
                  res.content[0].attrs.creator
                    ? "@" + res.content[0].attrs.creator.split("@")[0]
                    : "undefined"
                }_*\n▸ _Group Made_ : *_${
                  res.content[0].attrs.creation
                    ? moment(res.content[0].attrs.creation * 1000)
                        .tz("Asia/Jakarta")
                        .format("DD-MM-YYYY, HH:mm:ss")
                    : "undefined"
                }_*\n▸ _Member Length_ : *_${
                  res.content[0].attrs.size
                    ? res.content[0].attrs.size
                    : "undefined"
                }_*\n▸ _ID_  : *_${
                  res.content[0].attrs.id
                    ? res.content[0].attrs.id
                    : "undefined"
                }_*`;
                try {
                  ppgroup = await client.profilePictureUrl(
                    res.content[0].attrs.id + "@g.us",
                    "image"
                  );
                } catch {
                  ppgroup = "https://telegra.ph/file/95670d63378f7f4210f03.png";
                }
                client.sendFileUrl(from, ppgroup, "", m, {
                  caption: teks,
                  mentions: await pasrse_mention(teks),
                });
              });
          }
          break;
        case "getidgroup":
          {
            if (!isCreator) return m.reply(mess.owner);
            if (!m.isGroup) return m.reply(mess.group);

            m.reply(from);
          }
          break;
        case "pushkontak":
          {
            if (!text) return m.reply(`Contoh ${prefix}${command} Hello`);
            if (!isCreator) return m.reply(mess.owner);
            if (!m.isGroup) return m.reply(mess.group);
            if (!isBotAdmins) return m.reply(mess.botAdmin);
            if (!isAdmins) throw m.reply(mess.admin);
            let get_participant_group = await participants
              .filter((v) => v.id.endsWith(".net"))
              .map((v) => v.id);

            let hitung = get_participant_group.length;
            let hitung_pengiriman = 0;

            const estimasi = hitung_estimasi_waktu(hitung, interval());

            m.reply(
              `Sedang mengirm pesan...

Estimasi ~ [ ${estimasi.menit} menit ${estimasi.detik} detik ]
Total Member ~ [ ${get_participant_group.length} ]`
            );
            for (let i = 0; i < get_participant_group.length; i++) {
              try {
                await new Promise((resolve) => setTimeout(resolve, interval()));
                await client.sendMessage(get_participant_group[i], {
                  text: text,
                });
                hitung--;
                hitung_pengiriman++;

                if (hitung === 0)
                  return m.reply(
                    `*[ SUKSES MENGIRIM PESAN ]*
✅ Pesan terkirim ~ ${hitung_pengiriman}`
                  );
              } catch (error) {
                console.log(
                  `Gagal mengirim ke ${get_participant_group[i]}:`,
                  error
                );
              }
            }
          }
          break;
        case "pushid":
          {
            if (!isCreator) return m.reply(mess.owner);
            let idgc = text.split("|")[0];
            let pesan = text.split("|")[1];
            if (!idgc && !pesan)
              return m.reply(`Contoh: ${prefix + command} idgc|pesan`);
            let group_meta_data = await client
              .groupMetadata(idgc)
              .catch((e) => {
                m.reply(e);
              });
            let get_group_meta_data = await group_meta_data.participants
              .filter((v) => v.id.endsWith(".net"))
              .map((v) => v.id);

            let hitung = get_group_meta_data.length;
            let hitung_pengiriman = 0;

            const estimasi = hitung_estimasi_waktu(hitung, interval());

            m.reply(
              `Sedang mengirim pesan...

*[ INFORMASI GROUP ]*          
------------------------------------
🔴 _Nama Group: *${group_meta_data.subject}*_
🔴 _Total Member: *${get_group_meta_data.length}*_
🔴 _Estimasi : *${estimasi.menit} menit ${estimasi.detik} detik*_
------------------------------------`
            );
            for (let i = 0; i < get_group_meta_data.length; i++) {
              try {
                await new Promise((resolve) => setTimeout(resolve, interval()));
                await client.sendMessage(get_group_meta_data[i], {
                  text: pesan,
                });
                hitung--;
                hitung_pengiriman++;

                if (hitung === 0)
                  return m.reply(
                    `*[ SUKSES MENGIRIM PESAN ]*
✅ Pesan terkirim ~ ${hitung_pengiriman}`
                  );
              } catch (error) {
                console.log(
                  `Gagal mengirim ke ${get_group_meta_data[i]}:`,
                  error
                );
              }
            }
          }
          break;
        case "pushimg":
          {
            if (!isCreator) return m.reply(mess.owner);
            let idgc = text.split("|")[0];
            let caption = text.split("|")[1];

            if (!idgc || !caption)
              return m.reply(`Contoh: ${prefix + command} idgc|pesan`);

            if (/image/.test(mime)) {
              let media = await quoted.download();
              let group_meta_data = await client
                .groupMetadata(idgc)
                .catch((e) => {
                  m.reply(e);
                  return null;
                });

              let get_group_meta_data = group_meta_data.participants
                .filter((v) => v.id.endsWith(".net"))
                .map((v) => v.id);

              let hitung = get_group_meta_data.length;
              let hitung_pengiriman = 0;

              const estimasi = hitung_estimasi_waktu(hitung, interval());

              await client.sendMessage(sender, {
                react: {
                  text: "🕓",
                  key: m.key,
                },
              });

              m.reply(
                `Sedang mengirim pesan...

*[ INFORMASI GROUP ]*          
------------------------------------
🔴 _Nama Group: *${group_meta_data.subject}*_
🔴 _Total Member: *${get_group_meta_data.length}*_
🔴 _Estimasi : *${estimasi.menit} menit ${estimasi.detik} detik*_
------------------------------------`
              );

              for (let i = 0; i < get_group_meta_data.length; i++) {
                try {
                  await new Promise((resolve) =>
                    setTimeout(resolve, interval())
                  );
                  await client.sendImage(
                    get_group_meta_data[i],
                    media,
                    caption
                  );
                  hitung--;
                  hitung_pengiriman++;

                  if (hitung === 0)
                    return m.reply(
                      `*[ SUKSES MENGIRIM PESAN ]*
✅ Pesan terkirim ~ ${hitung_pengiriman}`
                    );
                } catch (error) {
                  console.log(
                    `Gagal mengirim ke ${get_group_meta_data[i]}:`,
                    error
                  );
                }
              }
            } else {
              m.reply(
                `Reply gambar dengan caption ${prefix}pushimg idgc|caption`
              );
            }
          }
          break;
        case "savekontak":
          {
            if (!isCreator) return m.reply(mess.owner);
            if (m.isGroup) return reply(mess.private);
            if (!text) return reply(`Contoh: ${prefix + command} idgroup`);
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
              kontak.push(member);
              fs.writeFileSync("./data/kontak.json", JSON.stringify(kontak));
            }
            try {
              const uniqueContacts = [...new Set(kontak)];
              const vcardContent = uniqueContacts
                .map((contact) => {
                  const vcard = [
                    "BEGIN:VCARD",
                    "VERSION:3.0",
                    `FN:WA[${create_serial(2)}] ${contact.split("@")[0]}`,
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
                  fileName: "kontak.vcf",
                  caption: `_*${mess.success}*_\n\n_Group:_ *_${groupMetadataa.subject}_*\n_Total Member:_ *_${participants.length}_*`,
                  mimetype: "text/vcard",
                },
                { quoted: m }
              );
              fs.writeFileSync("./data/kontak.vcf", "");
              kontak.splice(0, kontak.length);
              fs.writeFileSync("./data/kontak.json", JSON.stringify(kontak));
            }
          }
          break;
        default: {
          if (isCmd2 && body_type.toLowerCase() != undefined) {
            if (m.chat.endsWith("broadcast")) return;
            if (m.isBaileys) return;
            if (!body_type.toLowerCase()) return;
            if (argsLog || (isCmd2 && !m.isGroup)) {
              // client.sendReadReceipt(m.chat, m.sender, [m.key.id]);
              await client.sendMessage(m.key.remoteJid, {
                react: {
                  text: "❌",
                  key: m.key,
                },
              });
              client.sendText(m.key.remoteJid, "Perintah tidak tersedia :(", m);
              console.log(
                chalk.black(chalk.bgRed("[ ERROR ]")),
                color("PERINTAH |", "turquoise"),
                color(`${prefix}${command} |`, "turquoise"),
                color("TIDAK TERSEDIA", "turquoise")
              );
            } else if (argsLog || (isCmd2 && m.isGroup)) {
              // client.sendReadReceipt(m.chat, m.sender, [m.key.id]);
              client.sendMessage(m.key.remoteJid, {
                react: {
                  text: "❌",
                  key: m.key,
                },
              });
              client.sendText(m.key.remoteJid, "Perintah tidak tersedia :(", m);
              console.log(
                chalk.black(chalk.bgRed("[ ERROR ]")),
                color("PERINTAH |", "turquoise"),
                color(`${prefix}${command} |`, "turquoise"),
                color("TIDAK TERSEDIA", "turquoise")
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
