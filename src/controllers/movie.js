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

    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._closeDetailsPopup = this._closeDetailsPopup.bind(this);
    this._openDetailsPopup = this._openDetailsPopup.bind(this);
  }

  render(film) {
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    const subscribeOnEvents = (component) => {
      component.setAddToWatchlistClickHandler(onAddToWatchlistDetails);
      component.setAddToWatchedClickHandler(onAddToWatchedButtonClick);
      component.setAddToFavoriteClickHandler(onAddToFavoriteButtonClick);
    };

    const onAddToWatchlistDetails = () => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isAdded: !film.isAdded,
      }));
    };

    const onAddToWatchedButtonClick = () => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    };

    const onAddToFavoriteButtonClick = () => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    };

    subscribeOnEvents(this._filmComponent);
    this._filmComponent.setOpenDetailsClickHandler((evt) => {
      if (evt.target.tagName === `BUTTON`) {
        return;
      }
      this._openDetailsPopup();
    });

    // const onEmojiChange = (evt) => {
    //   if (evt.target.matches(`.film-details__emoji-item`)) {
    //     const emoji = evt.target.value;
    //     const commentEmojiELement = this._filmDetailsComponent.getElement()
    //       .querySelector(`.film-details__add-emoji-label`);

    //     clearElement(commentEmojiELement);
    //     render(commentEmojiELement, new EmojiComponent(emoji));
    //   }
    // };

    subscribeOnEvents(this._filmDetailsComponent);
    this._filmDetailsComponent.setCloseClickHandler(() => {
      this._closeDetailsPopup();
    });
    // this._filmDetailsComponent.setEmojiChangeHandler(onEmojiChange);

    render(this._container, this._filmComponent);

    if (oldFilmDetailsComponent && oldFilmComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeDetailsPopup();
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeydown);
  }

  _closeDetailsPopup() {
    document.removeEventListener(`keydown`, this._onEscKeydown);
    this._filmDetailsComponent.reset();

    if (document.contains(this._filmDetailsComponent.getElement())) {
      remove(this._filmDetailsComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _openDetailsPopup() {
    this._onViewChange();
    append(this._filmDetailsComponent);
    document.addEventListener(`keydown`, this._onEscKeydown);

    this._mode = Mode.EDIT;
  }

  _onEscKeydown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeDetailsPopup();
    }
  }
}
