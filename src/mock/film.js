import {getRandomArrayItem, getRandomFloat, getRandomIntInclusive, getRandomBoolean, getRandomIntFromArray, shuffleArray} from "../utils/common.js";
import {descriptions, genres, titles, posters, ageRatings, writers, actors, directors, countries, comments, MONTH_NAMES} from "../const.js";
import {generateComments} from "./comment.js";

export const MAX_RATING = 10;
export const MAX_MINUTES = 59;
export const MAX_HOURS = 3;

const getRandomReleaseDate = () => {
  const releaseDate = new Date();
  releaseDate.setFullYear(getRandomIntInclusive(1935, 1970));
  releaseDate.setMonth(getRandomIntFromArray(MONTH_NAMES));
  releaseDate.setDate(getRandomIntInclusive(0, 30));
  return releaseDate;
};

export const generateFilm = () => {
  return {
    id: String(new Date() + Math.random()),
    poster: getRandomArrayItem(posters),
    title: getRandomArrayItem(titles),
    originalTitle: getRandomArrayItem(titles),
    rating: getRandomFloat(MAX_RATING),
    releaseDate: getRandomReleaseDate(),
    duration: getRandomIntInclusive(0, 300),
    genres: shuffleArray(genres.slice(0, getRandomIntInclusive(1, genres.length - 1))),
    description: getRandomArrayItem(descriptions),
    comments: generateComments(getRandomIntFromArray(comments)),
    rated: getRandomArrayItem(ageRatings),
    director: getRandomArrayItem(directors),
    country: getRandomArrayItem(countries),
    actors,
    writers,
    userDetails: {
      watchlist: getRandomBoolean(),
      alreadyWatched: getRandomBoolean(),
      watchingDate: `2020-0${getRandomIntInclusive(1, 5)}-0${getRandomIntInclusive(1, 9)}T16:12:32.554Z`,
      favorite: getRandomBoolean(),
    },
  };
};

export const generateFilms = (count) => {
  return new Array(count).fill(``).map(generateFilm);
};
