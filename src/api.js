import MovieModel from "./models/movie";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(MovieModel.parseMovies);
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  updateMovie(id, movieData) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(movieData.toRaw()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then(MovieModel.parseMovie);
  }

  addComment(movieID, commentData) {
    return this._load({
      url: `comments/${movieID}`,
      method: Method.POST,
      body: JSON.stringify(commentData),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json());
  }

  deleteComment(commentID) {
    return this._load({
      url: `comments/${commentID}`,
      method: Method.DELETE,
      headers: new Headers({"Content-Type": `application/json`}),
    });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
