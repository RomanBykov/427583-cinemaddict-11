import AbstractComponent from "./abstract-component";
import moment from "moment";
import "moment-duration-format";
import {STAT_FILTER_VALUES} from "../const";
import {getStatsFilterName} from "../utils/filter";

const createButtonsMarkup = (names, currentFilter) => {
  return names
    .map((name) => {
      const filterName = getStatsFilterName(name);

      return (
        `<input
          type="radio"
          class="statistic__filters-input visually-hidden"
          name="statistic-filter"
          id="statistic-${name}"
          value="${name}"
          ${name === currentFilter ? `checked` : ``}>
        <label for="statistic-${name}" class="statistic__filters-label">${filterName}</label>`
      );
    }).join(`\n`);
};

const createStatisticsTemplate = (userDetails, period) => {
  const {totalWatchedMovies, totalDuration, topGenre} = userDetails;
  const duration = moment.duration(totalDuration, `minutes`).format(`h mm`);
  const durationHours = duration.split(` `)[0] || 0;
  const durationMinutes = duration.split(` `)[1] || 0;
  const buttonsMarkup = createButtonsMarkup(STAT_FILTER_VALUES, period);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${buttonsMarkup}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${totalWatchedMovies} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${durationHours} <span class="statistic__item-description">h</span> ${durationMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistics extends AbstractComponent {
  constructor(movies, {totalWatchedMovies, totalDuration, topGenre, filter}) {
    super();

    this._movies = movies;
    this._filter = filter;

    this._totalWatchedMovies = totalWatchedMovies;
    this._totalDuration = totalDuration;
    this._topGenre = topGenre;

    this.setStatFilterChangeHandler();
  }

  getTemplate() {
    return createStatisticsTemplate({
      totalWatchedMovies: this._totalWatchedMovies,
      totalDuration: this._totalDuration,
      topGenre: this._topGenre,
    }, this._filter);
  }

  hide() {
    super.hide();
  }

  setStatFilterChangeHandler(handler) {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, handler);
  }
}
