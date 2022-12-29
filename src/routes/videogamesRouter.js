const { Router } = require("express");
const { getListGames } = require("../controllers/videogames/get.videogames");
const router = Router();
const { Videogame, Genre } = require("../db.js");
const { API_KEY } = process.env;

router.get("/", async (req, res) => {
  const { name, genre } = req.query;
  let url;
  if (genre) {
    url = `https://api.rawg.io/api/games?genres=${genre}&key=57215a81e7e441c2957e294103f08214`;
  } else {
    url = `https://api.rawg.io/api/games?page=1&page_size=60&key=57215a81e7e441c2957e294103f08214`;
  }
  try {
    const videogames = await getListGames(url);
    if (name) {
      let gamesName = videogames.filter((el) =>
        el.name.toLowerCase().includes(name.toLowerCase())
      );
      gamesName.length
        ? res.status(200).send(gamesName)
        : res.status(404).send("El juego no existe");
    } else {
      res.status(200).send(videogames);
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      released,
      rating,
      platforms,
      background_image,
      genres,
    } = req.body;
    console.log("datos :", req.body);
    let newGame = await Videogame.create({
      name,
      description,
      released,
      rating,
      platforms,
      background_image,
    });
    let genreDb = await Genre.findAll({
      where: {
        name: genres,
      },
    });
    console.log(genreDb);
    await newGame.addGenres(genreDb);

    return res.status(201).send("Videojuego creado");
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

module.exports = router;
