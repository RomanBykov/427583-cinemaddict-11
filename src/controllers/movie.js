// import EmojiComponent from "../components/emoji";
import MovieComponent from "../components/movie";
import MovieDetailsComponent from "../components/movie-details";
import MovieModel from "../models/movie";
import {remove, append, render, replace} from "../utils/render";
import {reactions} from "../const";
// import {remove, append, render, clearElement, replace} from "../utils/render";
// import {commentAuthors, reactions} from "../const";
// import {getRandomArrayItem} from "../utils/common";

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._movieComponent = null;
    this._movieDetailsComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._api = api;

    this._viewersComments = [];
    this._commentEmoji = reactions[0];

    this._movie = null;
    this._movieID = null;

    this._openDetailsPopup = this._openDetailsPopup.bind(this);

    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._closeDetailsPopup = this._closeDetailsPopup.bind(this);
  }

  render(movie) {
    this._movie = movie;
    this._movieID = movie.id;
    const oldMovieComponent = this._movieComponent;

    this._movieComponent = new MovieComponent(movie);

    this._movieComponent.setAddToWatchlistClickHandler((evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(this._movie);
      newMovie.userDetails.watchlist = !this._movie.userDetails.watchlist;
      this._onDataChange(this, this._movie, newMovie);
    });

    this._movieComponent.setAddToWatchedClickHandler((evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(this._movie);
      newMovie.userDetails.alreadyWatched = !this._movie.userDetails.alreadyWatched;
      newMovie.userDetails.watchingDate = new Date();
      this._onDataChange(this, this._movie, newMovie);
    });

    this._movieComponent.setAddToFavoriteClickHandler((evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(this._movie);
      newMovie.userDetails.favorite = !this._movie.userDetails.favorite;
      this._onDataChange(this, this._movie, newMovie);
    });

    this._movieComponent.setOpenDetailsClickHandler((evt) => {
      if (evt.target.tagName === `BUTTON`) {
        return;
      }

      this._openDetailsPopup();
    });

    if (oldMovieComponent) {
      replace(this._movieComponent, oldMovieComponent);
    } else {
      render(this._container, this._movieComponent);
    }
  }

  _openDetailsPopup() {
    this._api.getComments(this._movieID)
      .then((loadedComments) => {
        this._viewersComments = loadedComments;

        this._movieDetailsComponent = new MovieDetailsComponent(this._movie, this._viewersComments);
        this._onViewChange();

        this._movieDetailsComponent.setAddToWatchlistClickHandler(() => {
          const newMovie = MovieModel.clone(this._movie);
          newMovie.userDetails.watchlist = !this._movie.userDetails.watchlist;
          this._onDataChange(this, this._movie, newMovie);
        });

        this._movieDetailsComponent.setAddToWatchedClickHandler(() => {
          const newMovie = MovieModel.clone(this._movie);
          newMovie.userDetails.alreadyWatched = !this._movie.userDetails.alreadyWatched;
          newMovie.userDetails.watchingDate = new Date();
          this._onDataChange(this, this._movie, newMovie);
        });

        this._movieDetailsComponent.setAddToFavoriteClickHandler(() => {
          const newMovie = MovieModel.clone(this._movie);
          newMovie.userDetails.favorite = !this._movie.userDetails.favorite;
          this._onDataChange(this, this._movie, newMovie);
        });

        this._movieDetailsComponent.setCloseClickHandler(() => {
          this._closeDetailsPopup();
        });

        // const updateComments = (id, newData) => {
        //   const comments = this._film.comments;

        //   if (newData === null) {
        //     this._viewersComments = comments.filter((comment) => comment.id !== id);
        //   }

        //   this._onDataChange(this, this._film, Object.assign({}, this._film, {
        //     comments: this._viewersComments,
        //   }));
        // };

        append(this._movieDetailsComponent);
        document.addEventListener(`keydown`, this._onEscKeydown);
        document.querySelector(`body`)
          .classList.add(`hide-overflow`);
      });
  }
  // const openDetailsPopup = () => {
  //   console.log(`click`);
  //   this._api.getComments(this._movieID)
  //     .then((loadedComments) => {
  //       this._viewersComments = loadedComments;

  //       this._movieDetailsComponent = new MovieDetailsComponent(this._film, this._viewersComments);
  //       this._onViewChange();


  //       append(this._movieDetailsComponent);


  //       // this._movieDetailsComponent.reset();
  //       const onEmojiChange = (evt) => {
  //         if (evt.target.matches(`.film-details__emoji-item`)) {
  //           const emoji = evt.target.value;
  //           this._commentEmoji = emoji;

  //           const commentEmojiELement = this._movieDetailsComponent.getElement()
  //             .querySelector(`.film-details__add-emoji-label`);

  //           clearElement(commentEmojiELement);
  //           render(commentEmojiELement, new EmojiComponent(emoji));
  //         }
  //       };

  //       const updateComments = (id, newData) => {
  //         const comments = this._film.comments;

  //         if (newData === null) {
  //           this._viewersComments = comments.filter((comment) => comment.id !== id);
  //         }

  //         this._onDataChange(this, this._film, Object.assign({}, this._film, {
  //           comments: this._viewersComments,
  //         }));
  //       };


  //       const onAddToFavoriteDetailsButtonClick = () => {
  //         const newFilm = MovieModel.clone(this._film);
  //         newFilm.userDetails.favorite = !this._film.userDetails.favorite;
  //         this._onDataChange(this, this._film, newFilm);
  //         this._film = newFilm;
  //         console.log(this._movieDetailsComponent);
  //         this._movieDetailsComponent.rerender();
  //       };

  //       this._movieDetailsComponent.setAddToFavoriteClickHandler(onAddToFavoriteDetailsButtonClick);

  //       // subscribeOnEvents(this._movieDetailsComponent);

  //       this._movieDetailsComponent.setCloseClickHandler(() => {
  //         this._closeDetailsPopup();
  //       });

  //       this._movieDetailsComponent.setEmojiChangeHandler(onEmojiChange);

  //       this._movieDetailsComponent.setCommentDeleteClickHandler((evt) => {
  //         evt.preventDefault();
  //         const target = evt.target;

  //         if (target.matches(`.film-details__comment-delete`)) {
  //           const commentId = target.closest(`.film-details__comment`).dataset.id;
  //           updateComments(commentId, null);
  //         }
  //       });

  //       this._movieDetailsComponent.setCommentSubmitHandler((evt) => {
  //         if (evt.ctrlKey && evt.key === `Enter`) {
  //           const newComment = {
  //             id: String(new Date() + Math.random()),
  //             reaction: this._commentEmoji,
  //             author: getRandomArrayItem(commentAuthors),
  //             date: new Date(),
  //             comment: evt.target.value,
  //           };

  //           this._viewersComments.push(newComment);
  //           updateComments(newComment.id, this._comments);
  //         }
  //       });

  //       document.addEventListener(`keydown`, this._onEscKeydown);

  //       this._mode = Mode.EDIT;
  //     });
  // };

  // }

  setDefaultView() {
    if (this._movieDetailsComponent) {
      this._closeDetailsPopup();
    }
  }

  destroy() {
    remove(this._movieComponent);

    if (this._movieDetailsComponent) {
      remove(this._movieDetailsComponent);
      document.removeEventListener(`keydown`, this._onEscKeydown);
    }
  }

  _closeDetailsPopup() {
    remove(this._movieDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeydown);
    document.querySelector(`body`)
      .classList.remove(`hide-overflow`);
  }

  _onEscKeydown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeDetailsPopup();
    }
  }
}
