const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const MOVIES = require("./movies.json");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 8000

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(validateBearerToken);

app.get("/movie", handleGetMovies)

function handleGetMovies(req, res) {
  const { genre, country, avg_vote } = req.query;

  let result = MOVIES;

  if(genre) {
    result = result.filter(movie => {
        return movie.genre.toLowerCase().includes(genre.toLowerCase());
    });
  };

  if(country) {
    result = result.filter(movie => {
        return movie.country.toLowerCase().includes(country.toLowerCase());
    });
  };

  if(avg_vote) {
    result = result.filter(movie => {
        return movie.avg_vote >= avg_vote;
    });
  };

  res.status(200).send(result);
};

function validateBearerToken(req, res, next) {
  const userKey = req.get('Authorization');
  const API_KEY = process.env.API_KEY
  console.log(API_KEY, userKey.split(" ")[1])
  if (!userKey || userKey.split(" ")[1] !== API_KEY) {
    return res.status(401).json({ "error": "Unauthorized requrest" })
  };
  next();
};

app.listen(PORT, () => console.log(`Started listening on port http://localhost:${PORT}`));