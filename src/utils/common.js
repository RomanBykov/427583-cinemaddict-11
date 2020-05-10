import moment from "moment";

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

export const formatFilmRuntime = (date) => {
  return moment(date).format(`h[h] mm[m]`);
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

