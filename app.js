const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const MOVIES = require("./movies.json");
const cors = require("cors");
require("dotenv").config();

const app = express();
const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "dev";


app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(validateBearerToken);
app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'Server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response);
});




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
    const numVote = parseInt(avg_vote);
    if(isNaN(numVote)) {
      return res.send(400)
    } else {
      result = result.filter(movie => {
        return movie.avg_vote >= numVote;
      });
    }; 
  };

  if(!result[0]) {
    return res.status(400).send({ error: { message: "query peramiter didn't didnt match any movies"}});
  };
  
  res.status(200).send(result);
};

function validateBearerToken(req, res, next) {
  const userKey = req.get('Authorization');
  const API_KEY = process.env.API_KEY
  if (!userKey || userKey.split(" ")[1] !== API_KEY) {
    return res.status(401).json({ "error": "Unauthorized requrest" })
  };
  next();
};

module.exports = app;