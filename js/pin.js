'use strict';

(function () {
  var ADS_LENGTH = 5;
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;

  var map = document.querySelector('.map');

  // создание меток на карте
  var renderMapPin = function (mapPin) {
    var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
    var mapPinElement = mapPinTemplate.cloneNode(true);
    mapPinElement.classList.add('hidden');
    mapPinElement.style = 'left: ' + (mapPin.location.x - 0.5 * MAP_PIN_WIDTH) + 'px; top: ' + (mapPin.location.y - MAP_PIN_HEIGHT) + 'px;';
    mapPinElement.querySelector('img').src = mapPin.author.avatar;
    mapPinElement.querySelector('img').alt = mapPin.offer.title;
    return mapPinElement;
  };

  // отрисовка элементов
  var getElements = function (data, action) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ADS_LENGTH; i++) {
      fragment.appendChild(action(data[i]));
    }
    return fragment;
  };

  // загрузка данных
  var loadElements = function () {
    var mapList = map.querySelector('.map__pins');
    var onLoad = function (data) {
      mapList.appendChild(getElements(data, renderMapPin));
    };
    var onError = function (msg) {
      window.form.errorHandler(msg);
    };
    window.backend.load(onLoad, onError);
  };

  window.pin = {
    getElements: getElements,
    loadElements: loadElements
  };
})();
