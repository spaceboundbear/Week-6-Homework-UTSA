var currentTime = moment().format('dddd, MMMM Do');
var inputEl = $('#search-text');
var searchBtn = $('#search-button');
var citylist = [];
var city = '';
var apiKey = '60a54b546e1ed6a05a743bca381ce7fc';

//----------------------------------------------------------------------------------//

$('#search-button').on('click', search);
$('.label-icon').on('click', search);

function search(event) {
  event.preventDefault();
  if (inputEl.val().trim() !== '') {
    city = inputEl.val().trim();
    getWeather(city);
  }
}

function find(c) {
  for (var i = 0; i < citylist.length; i++) {
    if (c.toUpperCase() === citylist[i]) {
      return -1;
    }
  }
  return 1;
}

function getWeather(city) {
  var urlCurrent =
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    city +
    '&Appid=' +
    apiKey +
    '&units=imperial';

  var urlForecast =
    'https://api.openweathermap.org/data/2.5/forecast?q=' +
    city +
    '&Appid=' +
    apiKey +
    '&units=imperial';

  $.ajax({
    url: urlCurrent,
    method: 'GET',
  }).then(function (response) {
    console.log(response);

    $('#city-name').html(response.name + ',  ' + currentTime);
    $('#weather-pic').html(
      "<img src='https://openweathermap.org/img/w/" +
        response.weather[0].icon +
        ".png' >"
    );
    $('#wind').html('Wind Speed: ' + response.wind.speed + ' MPH');
    $('#humidity').text('Humidity: ' + response.main.humidity + '%');
    $('#temp').text(response.main.temp + ' F');

    if (response.cod == 200) {
      citylist = JSON.parse(localStorage.getItem('city'));
      console.log(citylist);
      if (citylist == null) {
        citylist = [];
        citylist.push(city);
        localStorage.setItem('city', JSON.stringify(citylist));
        addCityList(city);
      } else {
        if (find(city) > 0) {
          citylist.push(city.toUpperCase());
          localStorage.setItem('city', JSON.stringify(citylist));
          addCityList(city);
        }
      }
    }

    var lat = response.coord.lat;
    var lon = response.coord.lon;
    var urlUV =
      'https://api.openweathermap.org/data/2.5/uvi?lat=' +
      lat +
      '&lon=' +
      lon +
      '&Appid=' +
      apiKey;

    $.ajax({
      url: urlUV,
      method: 'GET',
    }).then(function (response) {
      $('#uv-index').text('UV: ' + response.value);

      if (response.value <= 3) {
        $('.uv').addClass('card-panel left green');
        $('.uv').removeClass('yellow');
        $('.uv').removeClass('red');
      } else if (response.value <= 6 && response.value > 3) {
        $('.uv').addClass('card-panel left yellow');
        $('.uv').removeClass('green');
        $('.uv').removeClass('red');
      } else if (response.value >= 7 && response.value > 6) {
        $('.uv').addClass('card-panel left red');
        $('.uv').removeClass('yellow');
        $('.uv').removeClass('green');
      }
    });
  });

  $.ajax({
    url: urlForecast,
    method: 'GET',
  }).then(function (response) {
    console.log(response);

    var dayOne = moment(response.list[0].dt_txt).format('ddd, MMM D');
    var dayTwo = moment(response.list[8].dt_txt).format('ddd, MMM D');
    var dayThree = moment(response.list[16].dt_txt).format('ddd, MMM D');
    var dayFour = moment(response.list[24].dt_txt).format('ddd, MMM D');
    var dayFive = moment(response.list[32].dt_txt).format('ddd, MMM D');

    $('.day1-temp').text('Temp: ' + response.list[0].main.temp + ' F');
    $('.day1-time').html('<h6>' + dayOne + '</h6>');
    $('.day1-pic').html(
      "<img src='https://openweathermap.org/img/w/" +
        response.list[0].weather[0].icon +
        ".png' alt='weather icon.'>"
    );
    $('.day1-humid').text('Humidity: ' + response.list[0].main.humidity + '%');

    $('.day2-temp').text('Temp: ' + response.list[8].main.temp + ' F');
    $('.day2-time').html('<h6>' + dayTwo + '</h6>');
    $('.day2-pic').html(
      "<img src='https://openweathermap.org/img/w/" +
        response.list[8].weather[0].icon +
        ".png' alt='weather icon.'>"
    );
    $('.day2-humid').text('Humidity: ' + response.list[8].main.humidity + '%');

    $('.day3-temp').text('Temp: ' + response.list[16].main.temp + ' F');
    $('.day3-time').html('<h6>' + dayThree + '</h6>');
    $('.day3-pic').html(
      "<img src='https://openweathermap.org/img/w/" +
        response.list[16].weather[0].icon +
        ".png' alt='weather icon.'>"
    );
    $('.day3-humid').text('Humidity: ' + response.list[16].main.humidity + '%');

    $('.day4-temp').text('Temp: ' + response.list[24].main.temp + ' F');
    $('.day4-time').html('<h6>' + dayFour + '</h6>');
    $('.day4-pic').html(
      "<img src='https://openweathermap.org/img/w/" +
        response.list[24].weather[0].icon +
        ".png' alt='weather icon.'>"
    );
    $('.day4-humid').text('Humidity: ' + response.list[24].main.humidity + '%');

    $('.day5-temp').text('Temp: ' + response.list[32].main.temp + ' F');
    $('.day5-time').html('<h6>' + dayFive + '</h6>');
    $('.day5-pic').html(
      "<img src='https://openweathermap.org/img/w/" +
        response.list[32].weather[0].icon +
        ".png' alt='weather icon.'>"
    );
    $('.day5-humid').text('Humidity: ' + response.list[32].main.humidity + '%');
  });

  uvColor();
}

function addCityList(c) {
  var button = $('<a>' + c.toUpperCase() + '</a>');
  $(button).attr('class', 'waves-effect waves-light btn-large center');
  $(button).attr('data-value', c.toUpperCase());
  $('.city-list').append(button);
}

function pastSearch(event) {
  var button = event.target;
  if (event.target.matches('a')) {
    city = button.textContent.trim();
    getWeather(city);
  }
}

function onLoad() {
  var cityLoad = JSON.parse(localStorage.getItem('city'));
  if (cityLoad !== null) {
    cityLoad = JSON.parse(localStorage.getItem('city'));
    for (i = 0; i < cityLoad.length; i++) {
      addCityList(cityLoad[i]);
    }
    city = cityLoad[i - 1];
    getWeather(city);
  }
}

function uvColor() {
  var color = $('.uv').text();

  if (color <= 3) {
    $('uv').addClass('green');
  } else if (color >= 3 || color <= 6) {
    $('uv').addClass('yellow');
  } else $('uv').addClass('red');
}

function start() {
  getWeather('AUSTIN');
}

$(window).on('load', onLoad);
$(document).on('click', pastSearch);
