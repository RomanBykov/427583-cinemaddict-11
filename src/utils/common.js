import moment from "moment";
import "moment-duration-format";

export const formatMovieRuntime = (runtime) => {
  return moment.duration(runtime, `minutes`).format(`h[h] mm[m]`);
};

export const formatCommentDate = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:mm`);
};

export const formateReleaseDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
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
