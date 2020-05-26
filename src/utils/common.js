import moment from "moment";
import "moment-duration-format";

export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomIntFromArray = (array) => {
  return Math.floor(Math.random() * array.length);
};

export const getRandomFloat = (max) => {
  return Math.round(Math.random() * max * 10) / 10;
};

export const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

export const getRandomArrayItem = (array) => {
  return array[getRandomIntInclusive(0, array.length - 1)];
};

export const formatMovieRuntime = (runtime) => {
  return moment.duration(runtime, `minutes`).format(`h[h] mm[m]`);
};

export const formatCommentDate = (date) => {
  return moment(date).format(`YYYY/MM/DD hh:mm`);
};

export const formateReleaseDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const getUserRank = (watchedMovies) => {
  let rank;

  switch (true) {
    case watchedMovies === 0:
      rank = ``;
      break;
    case watchedMovies < 11:
      rank = `novice`;
      break;
    case watchedMovies < 21:
      rank = `fan`;
      break;
    case watchedMovies > 20:
      rank = `movie buff`;
      break;
  }

  return rank;
};
