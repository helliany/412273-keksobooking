'use strict';

var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира',
  'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик',
  'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var CHECK = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_LENGTH = 3;
var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var ADS_LENGTH = 8;
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;

// рандомное число
var getRandom = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// рандомный элемент массива
var getRandomElement = function (arr) {
  return arr[Math.floor((Math.random() * arr.length))];
};

// перемешать массив
var shuffleArr = function (array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

// создать массив в диапазоне
var getArr = function (min, max) {
  var array = [];
  for (var i = min; i <= max; i++) {
    array.push(i);
  }
  return array;
};

// рандомная длина массива
var getRandomLength = function (array) {
  return array.slice(getRandom(0, FEATURES.length - 1));
};

// создание массива фото
var renderPhoto = function () {
  var arr = [];
  for (var j = 1; j <= PHOTOS_LENGTH; j++) {
    arr[j - 1] = 'http://o0.github.io/assets/images/tokyo/hotel' + j + '.jpg';
  }
  return arr;
};

// создание массива объявлений
var fillArray = function () {
  var randomAvatar = shuffleArr(getArr(1, ADS_LENGTH));
  var randomTitle = shuffleArr(TITLE);
  var photosArray = renderPhoto();
  var adsArray = [];

  for (var j = 0; j < ADS_LENGTH; j++) {
    var LocationX = getRandom(LOCATION_X_MIN, LOCATION_X_MAX);
    var LocationY = getRandom(LOCATION_Y_MIN, LOCATION_Y_MAX);

    adsArray[j] = {
      author: {
        avatar: 'img/avatars/user0' + randomAvatar[j] + '.png'
      },
      offer: {
        title: randomTitle[j],
        address: LocationX + ', ' + LocationY,
        price: getRandom(PRICE_MIN, PRICE_MAX),
        type: getRandomElement(TYPE),
        rooms: getRandom(ROOMS_MIN, ROOMS_MAX),
        guests: getRandom(ROOMS_MIN, ROOMS_MAX),
        checkin: getRandomElement(CHECK),
        checkout: getRandomElement(CHECK),
        features: getRandomLength(shuffleArr(FEATURES)),
        description: '',
        photos: shuffleArr(photosArray)
      },
      location: {
        x: LocationX,
        y: LocationY,
      }
    };
  }
  return adsArray;
};
var ads = fillArray();

// переключение карты из неактивного состояния в активное
var map = document.querySelector('.map');
map.classList.remove('map--faded');

// создание меток на карте
var renderMapPin = function (mapPin) {
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPinElement = mapPinTemplate.cloneNode(true);
  mapPinElement.style = 'left: ' + (mapPin.location.x - 0.5 * MAP_PIN_WIDTH) + 'px; top: ' + (mapPin.location.y - MAP_PIN_HEIGHT) + 'px;';
  mapPinElement.querySelector('img').src = mapPin.author.avatar;
  mapPinElement.querySelector('img').alt = mapPin.offer.title;
  return mapPinElement;
};

// отрисовка меток
var addPinElements = function () {
  var mapList = map.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ADS_LENGTH; i++) {
    fragment.appendChild(renderMapPin(ads[i]));
  }
  mapList.appendChild(fragment);
};

addPinElements();

// создание объявлений
var renderMapCard = function (mapCard) {
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapCardElement = mapCardTemplate.cloneNode(true);

  var getType = function (type) {
    if (type === 'flat') {
      type = 'Квартира';
    } else if (type === 'bungalo') {
      type = 'Бунгало';
    } else if (type === 'house') {
      type = 'Дом';
    } else if (type === 'palace') {
      type = 'Дворец';
    }
    return type;
  };

  mapCardElement.querySelector('.popup__title').textContent = mapCard.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = mapCard.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = mapCard.offer.price + '₽/ночь';
  mapCardElement.querySelector('.popup__type').textContent = getType(mapCard.offer.type);
  mapCardElement.querySelector('.popup__text--capacity').textContent = mapCard.offer.rooms + ' комнаты для ' + mapCard.offer.guests + ' гостей';
  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + mapCard.offer.checkin + ', выезд до ' + mapCard.offer.checkout;
  mapCardElement.querySelector('.popup__features').textContent = '';
  for (var i = 0; i < mapCard.offer.features.length; i++) {
    mapCardElement.querySelector('.popup__features').insertAdjacentHTML('beforeend', '<li class="popup__feature popup__feature--' + mapCard.offer.features[i] + '"></li>');
  }
  mapCardElement.querySelector('.popup__description').textContent = mapCard.offer.description;
  mapCardElement.querySelector('.popup__photos').textContent = '';
  for (var j = 0; j < mapCard.offer.photos.length; j++) {
    mapCardElement.querySelector('.popup__photos').insertAdjacentHTML('beforeend', '<img src="' + mapCard.offer.photos[j] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
  }
  mapCardElement.querySelector('.popup__avatar').src = mapCard.author.avatar;
  return mapCardElement;
};

// отрисовка объявлений
var addCardElements = function () {
  var mapFilters = map.querySelector('.map__filters-container');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ADS_LENGTH; i++) {
    fragment.appendChild(renderMapCard(ads[i]));
  }
  map.insertBefore(fragment, mapFilters);
};

addCardElements();
