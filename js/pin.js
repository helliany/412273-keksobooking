'use strict';

(function () {
  var ADS_LENGTH = 8;
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

  // отрисовка меток
  var addElements = function () {
    var mapList = map.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ADS_LENGTH; i++) {
      fragment.appendChild(renderMapPin(window.data[i]));
    }
    mapList.appendChild(fragment);
  };

  window.pin = {
    addElements: addElements
  };
})();
