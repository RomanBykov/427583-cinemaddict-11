import FilmDetailsComponent from "../components/film-details.js";
import FilmComponent from "../components/film.js";
import EmojiComponent from "../components/emoji.js";
import {remove, append, render, clearElement, replace} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._filmComponent = null;
    this._filmDetailsComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._closeDetailsPopup = this._closeDetailsPopup.bind(this);
    this._openDetailsPopup = this._openDetailsPopup.bind(this);
  }

  render(film) {
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    const closeButtonClickHandler = () => {
      this._closeDetailsPopup();
    };

    const addToWatchlistButtonClickHandler = (evt) => {
      evt.preventDefault();

      this._onDataChange(film, Object.assign({}, film, {
        isAdded: !film.isAdded,
      }));
    };

    const markAsWatchedButtonClickHandler = (evt) => {
      evt.preventDefault();

      this._onDataChange(film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    };

    const markAsFavoriteButtonClickHandler = (evt) => {
      evt.preventDefault();

      this._onDataChange(film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    };

    const emojiClickHandler = (evt) => {
      if (evt.target.matches(`.film-details__emoji-item`)) {
        const emoji = evt.target.value;
        const commentEmojiELement = this._filmDetailsComponent.getElement()
          .querySelector(`.film-details__add-emoji-label`);

        clearElement(commentEmojiELement);
        render(commentEmojiELement, new EmojiComponent(emoji));
      }
    };

    const filmClickHandler = (evt) => {
      const target = evt.target;

      if (target.matches(`.film-card__poster`) || target.matches(`.film-card__title`) || target.matches(`.film-card__comments`)) {
        this._openDetailsPopup();
        this._filmDetailsComponent.setCloseClickHandler(closeButtonClickHandler);
        this._filmDetailsComponent.setEmojiClickHandler(emojiClickHandler);
      }
    };

    this._filmComponent.setOpenDetailsClickHandler(filmClickHandler);
    this._filmComponent.setAddToWatchlistButtonClickHandler(addToWatchlistButtonClickHandler);
    this._filmComponent.setMarkAsWatchedButtonClickHandler(markAsWatchedButtonClickHandler);
    this._filmComponent.setMarkIsFavoriteButtonClickHandler(markAsFavoriteButtonClickHandler);

    render(this._container, this._filmComponent);

    if (oldFilmDetailsComponent && oldFilmComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmComponent);
    }
  }

  _openDetailsPopup() {
    append(this._filmDetailsComponent);
    this._filmDetailsComponent.reset();
    this._onViewChange();
    document.addEventListener(`keydown`, this._escKeydownHandler);
    this._mode = Mode.EDIT;
  }

  _closeDetailsPopup() {
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._escKeydownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeydownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeDetailsPopup();
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeDetailsPopup();
    }
  }
}
