import {MONTH_NAMES} from "./const.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

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
  const hours = date.getHours() % 12 ? `${date.getHours() % 12}h` : ``;
  const minutes = date.getMinutes() ? `${date.getMinutes()}m` : ``;

  return `${hours} ${minutes}`;
};

export const formatCommentDate = (date) => {
  const hours = date.getUTCHours() % 24;
  const minutes = castTimeFormat(date.getMinutes());
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

export const formateReleaseDate = (date) => {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();

  return `${day} ${MONTH_NAMES[month]} ${year}`;
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
