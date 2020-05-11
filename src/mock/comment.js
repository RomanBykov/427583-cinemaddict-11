import {reactions, commentAuthors, comments} from "../const";
import {getRandomArrayItem, getRandomIntInclusive} from "../utils/common";

const getRandomDate = () => {
  const targetDate = new Date();
  const daysDiffValue = getRandomIntInclusive(0, 31);
  const minutesDiffValue = getRandomIntInclusive(0, 59);
  const hoursDiffValue = getRandomIntInclusive(0, 23);

  targetDate.setDate(targetDate.getDate() - daysDiffValue);
  targetDate.setMinutes(targetDate.getMinutes() - minutesDiffValue);
  targetDate.setUTCHours(targetDate.getUTCHours() - hoursDiffValue);

  return targetDate;
};

const generateComment = () => {
  return {
    id: String(Math.random() + new Date()),
    reaction: getRandomArrayItem(reactions),
    author: getRandomArrayItem(commentAuthors),
    date: getRandomDate(),
    comment: getRandomArrayItem(comments)
  };
};

export const generateComments = (count) => {
  return new Array(count).fill(``).map(generateComment);
};
