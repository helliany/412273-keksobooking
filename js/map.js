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
// var MAP_PIN_MAIN_WIDTH = 65;
// var MAP_PIN_MAIN_HEIGHT = 65;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

// форма, селекты комнат и гостей
var INDEX_NO_GUESTS = 3;
var VALUE_NO_GUESTS = 0;

var map = document.querySelector('.map');
var mapPinMain = map.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var adFieldset = adForm.querySelectorAll('fieldset');
var typeInput = adForm.querySelector('#type');
var timeInInput = adForm.querySelector('#timein');
var timeOutInput = adForm.querySelector('#timeout');
var roomInput = adForm.querySelector('#room_number');
var capacityInput = adForm.querySelector('#capacity');

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
    var locationX = getRandom(LOCATION_X_MIN, LOCATION_X_MAX);
    var locationY = getRandom(LOCATION_Y_MIN, LOCATION_Y_MAX);

    adsArray[j] = {
      author: {
        avatar: 'img/avatars/user0' + randomAvatar[j] + '.png'
      },
      offer: {
        title: randomTitle[j],
        address: locationX + ', ' + locationY,
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

addPinElements();

// создание карточек
var renderMapCard = function (mapCard) {
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapCardElement = mapCardTemplate.cloneNode(true);
  mapCardElement.classList.add('hidden');

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

// отрисовка карточек
var addCardElements = function () {
  var mapFilters = map.querySelector('.map__filters-container');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ADS_LENGTH; i++) {
    fragment.appendChild(renderMapCard(ads[i]));
  }
  map.insertBefore(fragment, mapFilters);
};

addCardElements();

// поля формы .ad-form заблокированы
var disableFieldset = function () {
  for (var i = 0; i < adFieldset.length; i++) {
    adFieldset[i].disabled = true;
  }
};
disableFieldset();

// переключение карты из неактивного состояния в активное
var mapPin = map.querySelectorAll('.map__pin');
var inputAddress = adForm.querySelector('#address');

inputAddress.value = (map.offsetWidth * 0.5) + ', ' + (map.offsetHeight * 0.5);

var onPinMainClick = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < adFieldset.length; i++) {
    adFieldset[i].disabled = false;
  }

  for (var j = 0; j < mapPin.length; j++) {
    mapPin[j].classList.remove('hidden');
  }
};

mapPinMain.addEventListener('mouseup', onPinMainClick);

// прячем карточку
var mapCard = map.querySelectorAll('.map__card');

var hideCardElements = function () {
  for (var i = 0; i < mapCard.length; i++) {
    mapCard[i].classList.add('hidden');
  }
};

// показываем карточку
var openCardElements = function (evt) {
  for (var i = 0; i < mapPin.length; i++) {
    if (mapPin[i] === evt.currentTarget && !mapPin[i].matches('.map__pin--main')) {
      mapCard[i - 1].classList.remove('hidden');
    }
  }
};

// показываем/прячем по клику/enter на пине
var openPopup = function () {
  for (var i = 0; i < mapPin.length; i++) {
    mapPin[i].addEventListener('click', function (evt) {
      hideCardElements();
      openCardElements(evt);
    });

    mapPin[i].addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        hideCardElements();
        openCardElements(evt);
      }
    });
  }
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    hideCardElements();
  }
};

// прячем по клику/enter на кнопке, esc
var closePopup = function () {
  var popupClose = map.querySelectorAll('.popup__close');
  for (var i = 0; i < popupClose.length; i++) {
    popupClose[i].addEventListener('click', function () {
      hideCardElements();
    });

    popupClose[i].addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        hideCardElements();
      }
    });

    document.addEventListener('keydown', onPopupEscPress);
  }
};

openPopup();
closePopup();

// выбор поля type
var typePrice = {
  flat: '1000',
  bungalo: '0',
  house: '5000',
  palace: '10000'
};

var selectType = function () {
  var priceInput = adForm.querySelector('#price');
  var userType = typeInput.options[typeInput.selectedIndex].value;
  var userPrice = typePrice[userType];
  priceInput.min = userPrice;
  priceInput.placeholder = userPrice;
};

typeInput.addEventListener('change', function () {
  selectType();
});

// синхронизация времени заезда и выезда
timeInInput.addEventListener('change', function () {
  timeOutInput.value = timeInInput.value;
});

timeOutInput.addEventListener('change', function () {
  timeInInput.value = timeOutInput.value;
});

// выбор поля rooms
var selectRoom = function () {
  var userRoomIndex = parseInt(roomInput.selectedIndex, 10);
  var userRoom = roomInput.options[userRoomIndex].value;

  for (var i = 0; i < capacityInput.options.length; i++) {
    capacityInput.options[i].disabled = true;
  }

  if (userRoomIndex === INDEX_NO_GUESTS) {
    capacityInput.options[INDEX_NO_GUESTS].disabled = false;
    return;
  }

  for (var j = 0; j < capacityInput.options.length; j++) {
    if (capacityInput.options[j].value <= userRoom && parseInt(capacityInput.options[j].value, 10) !== VALUE_NO_GUESTS) {
      capacityInput.options[j].disabled = false;
    }
  }
};

// синхронизация комнат и гостей
var syncRoomsGuests = function () {
  selectRoom();
  if (roomInput.options[INDEX_NO_GUESTS].selected) {
    capacityInput.options[INDEX_NO_GUESTS].selected = true;
  } else {
    for (var i = 0; i < capacityInput.options.length; i++) {
      if (capacityInput.options[i].value === roomInput.options[roomInput.selectedIndex].value) {
        capacityInput.options[i].selected = true;
      }
    }
  }
};

syncRoomsGuests();

roomInput.addEventListener('change', function () {
  syncRoomsGuests();
});
