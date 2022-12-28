require("dotenv").config();
const axios = require("axios");
const { Videogame, Genre } = require("../../db");
const Sequelize = require("sequelize");
const { API_KEY } = process.env;

const getListGames = async (url) => {
  let mapUrl = [];
  try {
    let games = await axios.get(url, {
      headers: { "Accept-Encoding": "gzip,deflate,compress" },
    });
    // let url2 = await axios.get(
    //   `https://api.rawg.io/api/games?page=2&key=${API_KEY}`,
    //   {
    //     headers: { "Accept-Encoding": "gzip,deflate,compress" },
    //   }
    //   )
    //   let url3 = await axios.get(
    //     `https://api.rawg.io/api/games?page=3&key=${API_KEY}`,
    //     {
    //       headers: { "Accept-Encoding": "gzip,deflate,compress" },
    //     }
    //     )
    // const api = [...url.data.results, ...url2.data.results, ...url3.data.results]
    const api = games.data.results;
    api.forEach((el) => {
      mapUrl.push({
        id: el.id,
        name: el.name,
        released: el.released,
        rating: el.rating,
        description: el.description_raw,
        platforms:
          el.platforms &&
          el.platforms.map((el) => {
            return { name: el.platform.name };
          }),
        genres:
          el.genres &&
          el.genres.map((e) => {
            return { name: e.name };
          }),
        img: el.background_image,
      });
    });

    const db = await Videogame.findAll({ include: [{ model: Genre }] });

    mapUrl = [...mapUrl, ...db];

    return mapUrl;
  } catch (error) {
    throw new Error("Cannot get videogames.");
  }
};

const getVideogamesById = async (id) => {
  const gameDone = [];
  if (id.includes("-")) {
    const found = await Videogame.findByPk(id, {
      include: [{ model: Genre }],
    });
    return found;
  } else {
    let gamesById = await axios.get(
      `https://api.rawg.io/api/games/${id}?key=${API_KEY}`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      }
    );
    gameDone.push(gamesById.data);
    const apiData = gameDone.map((e) => {
      return {
        id: e.id,
        name: e.name,
        background_image: e.background_image,
        released: e.released,
        rating: e.rating,
        description: e.description_raw,
        platforms: e.platforms?.map((e) => {
          return {
            name: e.platform.name,
          };
        }),
        genres: e.genres?.map((e) => {
          return {
            name: e.name,
          };
        }),
      };
    });
    const game = apiData.filter((e) => e.id == id);
    if (game.length > 0) {
      return game;
    }
  }
};

const getGenres = async () => {
  const genres = await axios.get(
    `https://api.rawg.io/api/genres?key=${API_KEY}`,
    {
      headers: { "Accept-Encoding": "gzip,deflate,compress" },
    }
  );
  await genres.data?.results?.forEach(async (g) => {
    await Genre.findOrCreate({
      where: {
        name: g.name,
      },
    });
  });

  const genresFromDb = await Genre.findAll();
  return genresFromDb;
};

module.exports = {
  getListGames,
  getVideogamesById,
  getGenres,
};

// `https://api.rawg.io/api/games?key=${API_KEY}`
// `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-rating&page_size=5`
// `https://api.rawg.io/api/games?key=${API_KEY}&search=${name}`
// `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
// `https://api.rawg.io/api/genres?key=${API_KEY}`
