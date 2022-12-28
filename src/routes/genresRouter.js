const { Router } = require("express");
const { getGenres } = require("../controllers/videogames/get.videogames");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const allGenres = await getGenres();
    return res.json(allGenres);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
