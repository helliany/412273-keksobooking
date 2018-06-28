'use strict';

(function () {
  var PHOTOS_LENGTH = 3;
  var ADS_LENGTH = 8;
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира',
    'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик',
    'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var ROOMS_MIN = 1;
  var ROOMS_MAX = 5;
  var CHECKS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var LOCATION_X_MIN = 300;
  var LOCATION_X_MAX = 900;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

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
    var randomAvatar = window.utils.shuffleArr(window.utils.getArr(1, ADS_LENGTH));
    var randomTitle = window.utils.shuffleArr(TITLES);
    var photosArray = renderPhoto();
    var adsArray = [];

    for (var j = 0; j < ADS_LENGTH; j++) {
      var locationX = window.utils.getRandom(LOCATION_X_MIN, LOCATION_X_MAX);
      var locationY = window.utils.getRandom(LOCATION_Y_MIN, LOCATION_Y_MAX);

      adsArray[j] = {
        author: {
          avatar: 'img/avatars/user0' + randomAvatar[j] + '.png'
        },
        offer: {
          title: randomTitle[j],
          address: locationX + ', ' + locationY,
          price: window.utils.getRandom(PRICE_MIN, PRICE_MAX),
          type: window.utils.getRandomElement(TYPES),
          rooms: window.utils.getRandom(ROOMS_MIN, ROOMS_MAX),
          guests: window.utils.getRandom(ROOMS_MIN, ROOMS_MAX),
          checkin: window.utils.getRandomElement(CHECKS),
          checkout: window.utils.getRandomElement(CHECKS),
          features: window.utils.getRandomLength(window.utils.shuffleArr(FEATURES)),
          description: '',
          photos: window.utils.shuffleArr(photosArray)
        },
        location: {
          x: locationX,
          y: locationY,
        }
      };
    }
    return adsArray;
  };

  window.data = fillArray();
})();
