//#region Movies
const ERROR_FETCH_MOVIE = "Error fetching movie.";
const ERROR_FETCH_MOVIES = "Error fetching movies.";
const ERROR_CREATE_MOVIE = "Error creating movie.";
const ERROR_UPDATE_MOVIE = "Error updating movie.";
const ERROR_DELETE_MOVIE = "Error deleting movie.";
//#endregion

//#region Producers
const ERROR_FETCH_PRODUCER = "Error fetching producer.";
const ERROR_FETCH_PRODUCERS = "Error fetching producers.";
const ERROR_FETCH_PRODUCER_INTERVALS = "Error querying ranges.";
const ERROR_CREATE_PRODUCER = "Error creating producer.";
const ERROR_UPDATE_PRODUCER = "Error updating producer.";
const ERROR_DELETE_PRODUCER = "Error deleting producer.";
//#endregion

//#region MoviesProducers
const ERROR_FETCH_MOVIE_PRODUCER =
  "Error fetching movie-producer relationship.";
const ERROR_FETCH_MOVIES_PRODUCERS =
  "Error fetching movies-producers relationships.";
const ERROR_CREATE_MOVIE_PRODUCER =
  "Error creating movies-producers relationship.";
const ERROR_UPDATE_MOVIE_PRODUCER =
  "Error updating movies-producers relationship.";
const ERROR_DELETE_MOVIE_PRODUCER =
  "Error deleting movies-producers relationship.";
//#endregion

//#region Internal
const ERROR_INTERNAL_SERVER = "Internal server error.";
const NOT_FOUND = "Not found.";
//#endregion

function messageNotFound(name, id) {
  return `${name} with id ${id} not found.`;
}

function messageFieldsRequired(fields) {
  return `Missing required fields: ${fields.join(", ")}`;
}

function messageRegisterAlreadyExists(name, value) {
  return `${name} with value '${value}' already exists.`;
}

module.exports = {
  ERROR_FETCH_MOVIE,
  ERROR_FETCH_MOVIES,
  ERROR_CREATE_MOVIE,
  ERROR_UPDATE_MOVIE,
  ERROR_DELETE_MOVIE,
  ERROR_FETCH_PRODUCER,
  ERROR_FETCH_PRODUCERS,
  ERROR_CREATE_PRODUCER,
  ERROR_UPDATE_PRODUCER,
  ERROR_DELETE_PRODUCER,
  ERROR_FETCH_MOVIE_PRODUCER,
  ERROR_FETCH_MOVIES_PRODUCERS,
  ERROR_CREATE_MOVIE_PRODUCER,
  ERROR_UPDATE_MOVIE_PRODUCER,
  ERROR_DELETE_MOVIE_PRODUCER,
  ERROR_FETCH_PRODUCER_INTERVALS,
  ERROR_INTERNAL_SERVER,
  NOT_FOUND,
  messageNotFound,
  messageFieldsRequired,
  messageRegisterAlreadyExists,
};
