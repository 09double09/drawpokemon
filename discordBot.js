import { channel } from "diagnostics_channel";
import { Client, GatewayIntentBits, Guild, REST, Routes } from "discord.js";
import { config } from "dotenv";
import drawPokemon from "./pokemon.js";
import express from "express";
config();
const app = express();
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {});
app.listen(port, () => {
  console.log("discordBot以上線");
});
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const token = process.env.BOT_TOKEN;

client.once("ready", async () => {
  console.log("ready for instruction");
  // const highGuilds = await client.guilds;
  // console.log(highGuilds);
  // const peko = await client.guilds.fetch("942418548079329322");
  // const general = await peko.channels.fetch("942418548079329326");
  // general.send("我是你爹的機器人大軍");
});

client.on("messageCreate", async (message) => {
  // if (message.content === "看個東西") {
  //   message.channel.send("你醜啥阿");
  // }
  // if (message.content === "嗨") {
  //   message.channel.send("你瞅啥阿");
  // }
  if (message.content === "!抽寶可夢") {
    const pokemonInfo = await drawPokemon();
    const { id, genus, name, flavor_text, spritesUrl, isZh } = pokemonInfo;
    if (isZh) {
      message.channel.send({
        content: `圖鑑編號:${id}\n名稱:${name}\n分類:${genus}\n${flavor_text}`,
        files: [spritesUrl],
      });
    }
    if (!isZh) {
      message.channel.send({
        content: `pokedex:${id}\nname:${name}\ngenera:${genus}\n${flavor_text}`,
        files: [spritesUrl],
      });
    }
  }
});

// client.once('')

client.login(token);
