import {getRandomArrayItem, getRandomFloat, getRandomIntInclusive, formatFilmRuntime, getRandomBoolean, getRandomIntFromArray, shuffleArray} from "../util.js";
import {descriptions, genres, titles, posters, ageRatings, writers, actors, directors, countries, comments, MONTH_NAMES} from "../const.js";
import {generateComments} from "./comment.js";

export const MAX_RATING = 10;
export const MAX_MINUTES = 59;
export const MAX_HOURS = 3;

const getRandomDuration = () => {
  const time = new Date();
  time.setHours(getRandomIntInclusive(0, MAX_HOURS));
  time.setMinutes(getRandomIntInclusive(0, MAX_MINUTES));
  return time;
};

const getRandomReleaseDate = () => {
  const releaseDate = new Date();
  releaseDate.setFullYear(getRandomIntInclusive(1935, 1970));
  releaseDate.setMonth(getRandomIntFromArray(MONTH_NAMES));
  releaseDate.setDate(getRandomIntInclusive(0, 30));
  return releaseDate;
};

export const generateFilm = () => {
  return {
    poster: getRandomArrayItem(posters),
    title: getRandomArrayItem(titles),
    originalTitle: getRandomArrayItem(titles),
    rating: getRandomFloat(MAX_RATING),
    releaseDate: getRandomReleaseDate(),
    duration: formatFilmRuntime(getRandomDuration()),
    genres: shuffleArray(genres.slice(0, getRandomIntInclusive(1, genres.length - 1))),
    description: getRandomArrayItem(descriptions),
    comments: generateComments(getRandomIntFromArray(comments)),
    isAdded: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
    rated: getRandomArrayItem(ageRatings),
    director: getRandomArrayItem(directors),
    country: getRandomArrayItem(countries),
    actors,
    writers
  };
};

export const generateFilms = (count) => {
  return new Array(count).fill(``).map(generateFilm);
};
