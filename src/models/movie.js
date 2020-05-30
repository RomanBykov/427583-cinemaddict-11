export default class Movie {
  constructor(movieData) {
    this.id = movieData.id;
    this.poster = movieData.film_info.poster;
    this.title = movieData.film_info.title;
    this.originalTitle = movieData.film_info.alternative_title;
    this.rating = movieData.film_info.total_rating;
    this.releaseDate = movieData.film_info.release.date;
    // console.log(typeof this.releaseDate);
    this.duration = movieData.film_info.runtime;
    this.genres = movieData.film_info.genre;
    this.description = movieData.film_info.description;
    this.comments = movieData.comments;
    this.rated = movieData.film_info.age_rating;
    this.director = movieData.film_info.director;
    this.country = movieData.film_info.release.release_country;
    this.actors = movieData.film_info.actors;
    this.writers = movieData.film_info.writers;
    this.userDetails = {
      watchlist: movieData.user_details.watchlist,
      alreadyWatched: movieData.user_details.already_watched,
      watchingDate: movieData.user_details.watching_date,
      favorite: movieData.user_details.favorite
    };
  }

  toRaw() {
    return {
      "id": this.id,
      "film_info": {
        "title": this.title,
        "alternative_title": this.originalTitle,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.rated,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.releaseDate,
          "release_country": this.country
        },
        "runtime": this.duration,
        "genre": this.genres,
        "description": this.description,
      },
      "user_details": {
        "watchlist": this.userDetails.watchlist,
        "already_watched": this.userDetails.alreadyWatched,
        "watching_date": this.userDetails.watchingDate,
        "favorite": this.userDetails.favorite
      },
      "comments": this.comments
    };
  }

  static parseMovie(movieData) {
    return new Movie(movieData);
  }

  static parseMovies(movieData) {
    return movieData.map(Movie.parseMovie);
  }

  static clone(movieData) {
    return new Movie(movieData.toRaw());
  }
}
