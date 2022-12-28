const { Router } = require("express");
// const { Videogame, Genre } = require('../db.js');
const {
  getVideogamesById,
} = require("../controllers/videogames/get.videogames");
const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const gamesById = await getVideogamesById(id);
    return res.send(gamesById);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const dbGame = await Videogame.findAll({
      where: {
        id: id,
      },
    });
    if (dbGame) {
      Videogame.destroy({
        where: {
          id: id,
        },
      });
      return res.status(200);
    } else {
      return res.status(404).send("error");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
