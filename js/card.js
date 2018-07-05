'use strict';

(function () {
  var map = document.querySelector('.map');

  // создание карточек
  var renderMapCard = function (mapCard) {
    var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
    var mapCardElement = mapCardTemplate.cloneNode(true);
    mapCardElement.classList.add('hidden');

    var getType = function (type) {
      switch (type) {
        case 'flat':
          type = 'Квартира';
          break;
        case 'bungalo':
          type = 'Бунгало';
          break;
        case 'house':
          type = 'Дом';
          break;
        case 'palace':
          type = 'Дворец';
          break;
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

  // загрузка данных
  var loadElements = function () {
    var mapFilters = map.querySelector('.map__filters-container');
    var onLoad = function (data) {
      map.insertBefore(window.pin.getElements(data, renderMapCard), mapFilters);
    };
    var onError = function (msg) {
      window.form.errorHandler(msg);
    };
    window.backend.load(onLoad, onError);
  };

  window.card = {
    loadElements: loadElements
  };
})();
