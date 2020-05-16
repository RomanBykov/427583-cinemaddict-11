import StatisticsComponent from "../components/statistics";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getKeyByValue} from "../utils/common";
import {Period, StatFilterType} from "../const";
import {render, remove} from "../utils/render";
import moment from "moment";
import "moment-duration-format";

const BAR_HEIGHT = 50;

const getAllGenresEntries = (films) => {
  return films
    .reduce((newArr, film) => {
      newArr.push(film.genres);

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


export default class StatisticsController {
  constructor(container, filmsModel) {
    this._container = container;
    this._films = filmsModel;

    this._genres = [];

    this._filterName = StatFilterType.ALL;
    this._periodCount = Period.ALL;
    this._genresChart = null;
    this._statisticsComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    this._renderStatisticsComponent();

    const chartContainer = this._statisticsComponent.getElement().querySelector(`.statistic__chart`);

    const genresCount = Object.keys(this._genres).length;
    chartContainer.height = BAR_HEIGHT * genresCount;

    this._resetChart();
    this._genresChart = this._applyChart(chartContainer, this._genres);
  }

  // TODO: Сделать перерендер (обновление) статистки при скрытии/показе и добавлении фильмов в просмотренные
  hide() {
    this._statisticsComponent.hide();
  }

  show() {
    this.render();
    this._statisticsComponent.show();
  }

  _renderStatisticsComponent() {
    const container = this._container;

    if (this._statisticsComponent) {
      remove(this._statisticsComponent);
    }

    const filteredFilms = this._getFilmsByDateRange(this._films, this._periodCount);
    this._genres = this._getCountedGenres(filteredFilms);

    const statisticsOptions = {
      totalWatchedFilms: this._getWatchedFilmsCount(filteredFilms),
      totalDuration: this._getTotalWatchedDuration(filteredFilms),
      topGenre: this._getTopGenre(this._genres),
      filter: this._filterName
    };

    this._statisticsComponent = new StatisticsComponent(filteredFilms, statisticsOptions);
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

  _getCountedGenres(films) {
    const allGenres = getAllGenresEntries(films);
    return countGenres(allGenres);
  }

  _getWatchedFilmsCount(films) {
    return films.length;
  }

  _getTotalWatchedDuration(films) {
    return films.reduce((acc, film) => {
      acc += film.duration;
      return acc;
    }, 0);
  }

  _getFilmsByDateRange(films, period) {
    return films.filter((film) => {
      const watchedDate = moment(moment(film.userDetails.watchingDate).toArray().slice(0, 3));
      const nowDate = moment(moment().toArray().slice(0, 3));

      return nowDate.diff(watchedDate, `days`) <= period;
    });
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
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
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
