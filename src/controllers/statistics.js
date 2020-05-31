import StatisticsComponent from "../components/statistics";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getKeyByValue} from "../utils/common";
import {Period, StatFilterType, StatsMode} from "../const";
import {render, remove} from "../utils/render";
import moment from "moment";
import "moment-duration-format";

const CHART_OPTIONS = {
  BAR_HEIGHT: 50,
  FONT_COLOR: `#ffffff`,
  BACKGROUND_COLOR: `#ffe800`,
  FONT_SIZE: 20,
  ALIGN: `start`,
  OFFSET: 40,
  PADDING: 100,
  BAR_THICKNESS: 24
};

const getAllGenresEntries = (movies) => {
  return movies
    .reduce((newArr, movie) => {
      newArr.push(movie.genres);

      return newArr;
    }, [])
    .flat();
};

const countGenres = (genres) => {
  return genres.reduce((genresNames, genre) => {
    genresNames[genre] = ++genresNames[genre] || 1;
    return genresNames;
  }, {});
};

export default class Statistics {
  constructor(container, moviesModel, userRank) {
    this._container = container;
    this._movies = moviesModel;
    this._userRank = userRank;

    this._genres = [];

    this._filterName = StatFilterType.ALL;
    this._periodCount = Period.ALL;
    this._genresChart = null;
    this._statisticsComponent = null;
    this._mode = StatsMode.HIDDEN;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  updateMovies(movies) {
    this._movies = movies;
  }

  getMode() {
    return this._mode;
  }

  render() {
    this._renderStatisticsComponent();

    const chartContainer = this._statisticsComponent.getChartContainer();

    const genresCount = Object.keys(this._genres).length;
    chartContainer.height = CHART_OPTIONS.BAR_HEIGHT * genresCount;

    this._resetChart();
    this._genresChart = this._applyChart(chartContainer, this._genres);
  }

  hide() {
    this._statisticsComponent.hide();
    this._mode = StatsMode.HIDDEN;
  }

  show() {
    this.setToDefault();
    this.render();
    this._statisticsComponent.show();
    this._mode = StatsMode.SHOWED;
  }

  setToDefault() {
    this._periodCount = Period.ALL;
    this._filterName = StatFilterType.ALL;
  }

  _renderStatisticsComponent() {
    const container = this._container;

    if (this._statisticsComponent) {
      remove(this._statisticsComponent);
    }

    const filteredMovies = this._getMoviesByDateRange(this._movies, this._periodCount);
    this._genres = this._getCountedGenres(filteredMovies);

    const statisticsOptions = {
      totalWatchedMovies: this._getWatchedMoviesCount(filteredMovies),
      totalDuration: this._getTotalWatchedDuration(filteredMovies),
      topGenre: this._getTopGenre(this._genres),
      filter: this._filterName
    };

    this._statisticsComponent = new StatisticsComponent(filteredMovies, statisticsOptions, this._userRank);
    this._statisticsComponent.setStatFilterChangeHandler(this._onFilterChange);
    render(container, this._statisticsComponent);
  }

  _onFilterChange(evt) {
    const filter = evt.target.id.slice(10);
    this._filterName = filter;

    const period = filter.toUpperCase().split(`-`)[0];
    this._periodCount = Period[period];

    this._updateStatistics();
  }

  _updateStatistics() {
    this.render();
  }

  _getTopGenre(genres) {
    let topGenre = ``;
    const maxViewsCount = Math.max(...Object.values(genres));

    if (maxViewsCount > 0) {
      topGenre = getKeyByValue(genres, maxViewsCount);
    }

    return topGenre;
  }

  _getCountedGenres(movies) {
    const allGenres = getAllGenresEntries(movies);
    return countGenres(allGenres);
  }

  _getWatchedMoviesCount(movies) {
    return movies.length;
  }

  _getTotalWatchedDuration(movies) {
    return movies.reduce((acc, movie) => {
      acc += movie.duration;
      return acc;
    }, 0);
  }

  _getMoviesByDateRange(movies, period) {
    if (period !== null) {
      return movies.filter((movie) => {
        const watchedDate = moment(moment(movie.userDetails.watchingDate).toArray().slice(0, 3));
        const nowDate = moment(moment().toArray().slice(0, 3));

        return nowDate.diff(watchedDate, `days`) <= period;
      });
    } else {
      return movies;
    }
  }

  _resetChart() {
    if (this._genresChart) {
      this._genresChart.destroy();
      this._genresChart = null;
    }
  }

  _applyChart(container, genres) {
    this._genres = genres;

    return new Chart(container, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(genres),
        datasets: [{
          data: Object.values(genres),
          backgroundColor: CHART_OPTIONS.BACKGROUND_COLOR,
          hoverBackgroundColor: CHART_OPTIONS.BACKGROUND_COLOR,
          anchor: CHART_OPTIONS.ALIGN
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: CHART_OPTIONS.FONT_SIZE
            },
            color: CHART_OPTIONS.FONT_COLOR,
            anchor: CHART_OPTIONS.ALIGN,
            align: CHART_OPTIONS.ALIGN,
            offset: CHART_OPTIONS.OFFSET,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: CHART_OPTIONS.FONT_COLOR,
              padding: CHART_OPTIONS.PADDING,
              fontSize: CHART_OPTIONS.FONT_SIZE
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: CHART_OPTIONS.BAR_THICKNESS
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }
}
