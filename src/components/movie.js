import AbstractComponent from "./abstract-component";
import {buttonClassNames} from "../const";
import {formatMovieRuntime} from "../utils/common";
import moment from "moment";

const cutDescription = (description) => {
  const MAX_DESCRIPTION_LENGTH = 140;

  return description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(0, MAX_DESCRIPTION_LENGTH - 1)}…` : description;
};

const createButtonMarkup = (name, isActive = true) => {
  const activeClassName = `film-card__controls-item--active`;

  return (
    `<button
      class="film-card__controls-item button film-card__controls-item--${name} ${isActive ? activeClassName : ``}"
    >${buttonClassNames[name]}</button>`
  );
};

const createMovieTemplate = (movie) => {
  const {
    poster,
    title,
    rating,
    releaseDate,
    duration,
    genres,
    description,
    comments,
    userDetails,
  } = movie;

  const formatedRuntime = formatMovieRuntime(duration);
  const commentsCount = comments.length;
  const genre = genres[0];
  const release = moment(releaseDate).format(`YYYY`);
  const shortDescription = cutDescription(description);

  const addToWatchButton = createButtonMarkup(`add-to-watchlist`, userDetails.watchlist);
  const markAsWatchedButton = createButtonMarkup(`mark-as-watched`, userDetails.alreadyWatched);
  const markAsFavoriteButton = createButtonMarkup(`favorite`, userDetails.favorite);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${release}</span>
        <span class="film-card__duration">${formatedRuntime}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        ${addToWatchButton}
        ${markAsWatchedButton}
        ${markAsFavoriteButton}
      </form>
    </article>`
  );
};

export default class Movie extends AbstractComponent {
  constructor(movie) {
    super();
    this._movie = movie;
  }

  getTemplate() {
    return createMovieTemplate(this._movie);
  }

  setOpenDetailsClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setAddToWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setAddToFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
