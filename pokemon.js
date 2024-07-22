import { ConnectionService } from "discord.js";
import { Random } from "random-js";

const language = "zh-Hant";
const pokemonBaseURL = "https://pokeapi.co/api/v2/pokemon/?limit=1302";
const getAllPokemon = async () => {
  const pokeRes = await fetch(pokemonBaseURL);
  if (pokeRes.ok) {
    const allPokeData = await pokeRes.json();
    return allPokeData;
  } else {
    const errorMessage = await pokeRes.json();
    return errorMessage;
  }
};

const getPokemonInfoUrl = async (pokemonUrl) => {
  const infoRes = await fetch(pokemonUrl);
  if (infoRes.ok) {
    const resData = await infoRes.json();
    const { forms, species, sprites } = resData;
    const formsUrl = forms[0].url;
    const speciesUrl = species.url;
    const spritesUrl = sprites.front_default;
    const urls = {
      formsUrl: formsUrl,
      speciesUrl: speciesUrl,
      spritesUrl: spritesUrl,
    };
    return urls;
  } else {
    console.error("獲取不到");
  }
};

const getPokemonInfo = async (specieUrl) => {
  const infoRes = await fetch(specieUrl);
  if (infoRes.ok) {
    let isZh = true;
    const infoData = await infoRes.json();
    const { genera, names, flavor_text_entries, id } = infoData;

    const zhGenera = genera.find((gen) => {
      if (gen.language.name === language) {
        return gen.genus;
      }
    });

    const zhName = names.find((name) => {
      if (name.language.name === language) {
        return name.name;
      }
    });

    const zhDescription = flavor_text_entries.find((text) => {
      if (text.language.name === language) {
        return text.flavor_text;
      }
    });
    if (zhDescription == undefined) {
      isZh = false;
      const secondLanguage = "en";
      const jaGenera = genera.find((gen) => {
        if (gen.language.name.includes(secondLanguage)) {
          return gen.genus;
        }
      });

      const jaName = names.find((name) => {
        if (name.language.name.includes(secondLanguage)) {
          return name.name;
        }
      });

      const jaDescription = flavor_text_entries.find((text) => {
        if (text.language.name.includes(secondLanguage)) {
          return text.flavor_text;
        }
      });
      const formatInfo = {
        isZh: isZh,
        jaGenera,
        jaName,
        jaDescription,
        id,
      };
      return formatInfo;
    }
    const formatInfo = {
      isZh: isZh,
      zhGenera,
      zhName,
      zhDescription,
      id,
    };
    return formatInfo;
  } else {
    console.error("拿不到pokemonInfo");
  }
};

const main = async () => {
  const random = new Random();
  const rate = Math.random();
  let pokemonId;
  rate <= 0.1
    ? (pokemonId = random.integer(1026, 1302))
    : (pokemonId = random.integer(0, 1025));

  const pokemonsData = await getAllPokemon();
  const pokemons = pokemonsData.results;
  const pokemon = pokemons[pokemonId];
  const { url } = pokemon;

  const pokeDetailUrl = await getPokemonInfoUrl(url);
  const { speciesUrl, spritesUrl } = pokeDetailUrl;
  const pokeInfo = await getPokemonInfo(speciesUrl);
  if (pokeInfo.isZh) {
    const { zhGenera, zhName, zhDescription, id, isZh } = pokeInfo;
    const { genus } = zhGenera;
    const { name } = zhName;
    const { flavor_text } = zhDescription;
    const pokemonData = {
      isZh: isZh,
      id: id,
      genus: genus,
      name: name,
      flavor_text: flavor_text,
      spritesUrl,
    };
    return pokemonData;
  } else {
    const { jaGenera, jaName, jaDescription, id, isZh } = pokeInfo;
    const { genus } = jaGenera;
    const { name } = jaName;
    const { flavor_text } = jaDescription;
    const pokemonData = {
      isZh: isZh,
      id: id,
      genus: genus,
      name: name,
      flavor_text: flavor_text,
      spritesUrl: spritesUrl,
    };
    return pokemonData;
  }
};

export default main;
