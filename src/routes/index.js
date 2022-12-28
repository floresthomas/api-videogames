const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const genresRouter = require("./genresRouter");
const videogameRouter = require("./videogameRouter");
const videogamesRouter = require("./videogamesRouter");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/videogames", videogamesRouter);
router.use("/videogame", videogameRouter);
router.use("/genres", genresRouter);

module.exports = router;
