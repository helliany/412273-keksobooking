'use strict';

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
var PHOTOS_LENGTH = 3;
var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var ADS_LENGTH = 8;
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;
var MAP_PIN_MAIN_WIDTH = 65;
var MAP_PIN_MAIN_HEIGHT = 85;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var VALUE_ROOM_NO_GUESTS = 100;
var VALUE_CAPACITY_NO_GUESTS = 0;
// координаты пина
var START_PIN_MAIN_X = 570;

var map = document.querySelector('.map');
var mapPinMain = map.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var adFieldset = adForm.querySelectorAll('fieldset');
var addressField = adForm.querySelector('#address');
var typeField = adForm.querySelector('#type');
var timeInField = adForm.querySelector('#timein');
var timeOutField = adForm.querySelector('#timeout');
var roomField = adForm.querySelector('#room_number');

// словарь типов жилья и цены
var typePrice = {
  flat: '1000',
  bungalo: '0',
  house: '5000',
  palace: '10000'
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
var ads = fillArray();

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
var addPinElements = function () {
  var mapList = map.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ADS_LENGTH; i++) {
    fragment.appendChild(renderMapPin(ads[i]));
  }
  mapList.appendChild(fragment);
};

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

// отрисовка карточек
var addCardElements = function () {
  var mapFilters = map.querySelector('.map__filters-container');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ADS_LENGTH; i++) {
    fragment.appendChild(renderMapCard(ads[i]));
  }
  map.insertBefore(fragment, mapFilters);
};

// поля формы .ad-form заблокированы
var disableFieldset = function () {
  for (var i = 0; i < adFieldset.length; i++) {
    adFieldset[i].disabled = true;
  }
};

// координаты главного пина
var setCoords = function () {
  addressField.value = (mapPinMain.offsetLeft + Math.floor(MAP_PIN_MAIN_WIDTH * 0.5)) + ', ' + (mapPinMain.offsetTop + Math.floor(MAP_PIN_MAIN_WIDTH * 0.5));
};

// переключение карты из неактивного состояния в активное
var onMapPinMainClick = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < adFieldset.length; i++) {
    adFieldset[i].disabled = false;
  }

  for (var j = 0; j < mapPin.length; j++) {
    mapPin[j].classList.remove('hidden');
  }
};

// прячем карточку
var hideElements = function () {
  for (var i = 0; i < mapCard.length; i++) {
    mapCard[i].classList.add('hidden');
  }
};

// показываем карточку
var openElements = function (evt) {
  for (var i = 0; i < mapPin.length; i++) {
    if (mapPin[i] === evt.currentTarget && !mapPin[i].matches('.map__pin--main')) {
      mapCard[i - 1].classList.remove('hidden');
    }
  }
};

// выбор поля type
var selectType = function () {
  var priceField = adForm.querySelector('#price');
  var userType = typeField.options[typeField.selectedIndex].value;
  var userPrice = typePrice[userType];
  priceField.min = userPrice;
  priceField.placeholder = userPrice;
};

typeField.addEventListener('change', function () {
  selectType();
});

// синхронизация времени заезда и выезда
timeInField.addEventListener('change', function () {
  timeOutField.value = timeInField.value;
});

timeOutField.addEventListener('change', function () {
  timeInField.value = timeOutField.value;
});

// синхронизация комнат и гостей
var syncRoomsGuests = function () {
  var capacityField = adForm.querySelectorAll('#capacity option');

  capacityField.forEach(function (item) {
    var userRoom = parseInt(roomField.value, 10);
    var value = parseInt(item.value, 10);
    if (userRoom === VALUE_ROOM_NO_GUESTS) {
      item.disabled = (value !== VALUE_CAPACITY_NO_GUESTS);
      item.selected = (value === VALUE_CAPACITY_NO_GUESTS);
    } else {
      item.disabled = (value === VALUE_CAPACITY_NO_GUESTS || value > userRoom);
      item.selected = (value === userRoom);
    }
  });
};

roomField.addEventListener('change', function () {
  syncRoomsGuests();
});

// перетаскивание главного пина
var onMouseDown = function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var mapPinMainX = mapPinMain.offsetLeft - shift.x;
    var mapPinMainY = mapPinMain.offsetTop - shift.y;

    if (mapPinMainY > LOCATION_Y_MAX - MAP_PIN_MAIN_HEIGHT) {
      mapPinMainY = LOCATION_Y_MAX - MAP_PIN_MAIN_HEIGHT;
    } else if (mapPinMainY < LOCATION_Y_MIN) {
      mapPinMainY = LOCATION_Y_MIN;
    }

    if (mapPinMainX > map.offsetWidth - MAP_PIN_MAIN_WIDTH) {
      mapPinMainX = map.offsetWidth - MAP_PIN_MAIN_WIDTH;
    } else if (mapPinMainX < 0) {
      mapPinMainX = 0;
    }

    mapPinMain.style.top = mapPinMainY + 'px';
    mapPinMain.style.left = mapPinMainX + 'px';
    addressField.value = (mapPinMainX + Math.floor(MAP_PIN_MAIN_WIDTH * 0.5)) + ', ' + (mapPinMainY + MAP_PIN_MAIN_HEIGHT);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    onMapPinMainClick();
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

mapPinMain.addEventListener('mousedown', function (evt) {
  onMouseDown(evt);
});

// форма заблокирована
var disableForm = function () {
  disableFieldset();
  addPinElements();
  addCardElements();
  setCoords();
  selectType();
  syncRoomsGuests();
};

disableForm();

var mapPin = map.querySelectorAll('.map__pin');
var mapCard = map.querySelectorAll('.map__card');
var popupClose = map.querySelectorAll('.popup__close');

// показываем/прячем по клику/enter на пине
mapPin.forEach(function (mapItem) {
  mapItem.addEventListener('click', function (evt) {
    hideElements();
    openElements(evt);
  });

  mapItem.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      hideElements();
      openElements(evt);
    }
  });
});

// прячем по клику/enter на кнопке, esc
popupClose.forEach(function (popupCloseItem) {
  popupCloseItem.addEventListener('click', function () {
    hideElements();
  });

  popupCloseItem.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      hideElements();
    }
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      hideElements();
    }
  });
});

// сброс формы, координат главного пина
var onAdFormReset = function () {
  mapPinMain.style.top = (map.offsetHeight * 0.5) + 'px';
  mapPinMain.style.left = START_PIN_MAIN_X + 'px';
  setTimeout(function () {
    selectType();
    syncRoomsGuests();
    addressField.value = (mapPinMain.offsetLeft + Math.floor(MAP_PIN_MAIN_WIDTH * 0.5)) + ', ' + (mapPinMain.offsetTop + MAP_PIN_MAIN_HEIGHT);
  });
};

adForm.addEventListener('reset', function () {
  onAdFormReset();
});
