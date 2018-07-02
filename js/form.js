'use strict';

(function () {
  var VALUE_ROOM_NO_GUESTS = 100;
  var VALUE_CAPACITY_NO_GUESTS = 0;
  var MAP_PIN_MAIN_WIDTH = 65;
  var MAP_PIN_MAIN_HEIGHT = 85;
  var START_PIN_MAIN_X = 570;
  var ESC_KEYCODE = 27;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var typeField = adForm.querySelector('#type');
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var roomField = adForm.querySelector('#room_number');
  var addressField = adForm.querySelector('#address');
  var successSending = document.querySelector('.success');

  // словарь типов жилья и цены
  var typeToPrice = {
    flat: '1000',
    bungalo: '0',
    house: '5000',
    palace: '10000'
  };

  // поля формы .ad-form заблокированы
  var disableFieldset = function (value) {
    var adFieldset = adForm.querySelectorAll('fieldset');
    for (var i = 0; i < adFieldset.length; i++) {
      adFieldset[i].disabled = value;
    }
  };

  // синхронизация типа жилья и цены
  var selectType = function () {
    var priceField = adForm.querySelector('#price');
    var userType = typeField.options[typeField.selectedIndex].value;
    var userPrice = typeToPrice[userType];
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

  // координаты главного пина
  var setCoords = function () {
    addressField.value = (mapPinMain.offsetLeft + Math.floor(MAP_PIN_MAIN_WIDTH * 0.5)) + ', ' + (mapPinMain.offsetTop + MAP_PIN_MAIN_HEIGHT);
  };

  // скрыть пины после сброса
  var hidePin = function () {
    var mapPin = map.querySelectorAll('.map__pin');
    for (var j = 1; j < mapPin.length; j++) {
      mapPin[j].classList.add('hidden');
    }
  };

  // прячем карточки
  var hideCard = function () {
    var mapCard = map.querySelectorAll('.map__card');
    var mapPin = map.querySelectorAll('.map__pin');
    mapCard.forEach(function (cardItem) {
      cardItem.classList.add('hidden');
    });
    mapPin.forEach(function (pinItem) {
      pinItem.classList.remove('map__pin--active');
    });
  };

  // сброс формы, координат главного пина
  var onAdFormReset = function () {
    mapPinMain.style.top = (map.offsetHeight * 0.5) + 'px';
    mapPinMain.style.left = START_PIN_MAIN_X + 'px';

    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');

    hidePin();
    hideCard();
    disableFieldset(true);
    setTimeout(function () {
      selectType();
      syncRoomsGuests();
      setCoords();
    });
  };

  adForm.addEventListener('reset', function () {
    onAdFormReset();
  });

  // валидация инпутов
  var validateInput = function (input) {
    if (!input.validity.valid) {
      input.classList.add('ad-form__element--border-red');
    } else {
      input.classList.remove('ad-form__element--border-red');
    }
  };

  var validateFields = function () {
    var fields = document.querySelectorAll('input');
    fields.forEach(function (input) {
      input.addEventListener('invalid', function () {
        validateInput(input);
      });
      input.addEventListener('input', function () {
        validateInput(input);
      });
      adForm.addEventListener('reset', function () {
        validateInput(input);
      });
    });
  };

  // ошибка загрузки
  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 2; width: 100%; height: 100%; padding-top: 300px; text-align: center; background-color: rgba(0, 0, 0, 0.8)';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.top = 0;
    node.style.fontSize = '50px';
    node.style.color = '#ffffff';
    node.style.fontWeight = '700';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    // скрывает сообщение об ошибке
    node.addEventListener('click', function () {
      node.classList.add('hidden');
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        node.classList.add('hidden');
      }
    });
  };

  // отмена действия формы по умолчанию
  adForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(adForm), function () {
      onAdFormReset();
      adForm.reset();
      successSending.classList.remove('hidden');
    }, errorHandler);
    evt.preventDefault();
  });

  // скрывает сообщение об успешной отправке формы
  successSending.addEventListener('click', function () {
    successSending.classList.add('hidden');
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      successSending.classList.add('hidden');
    }
  });

  window.form = {
    disableFieldset: disableFieldset,
    hideCard: hideCard,
    setCoords: setCoords,
    selectType: selectType,
    syncRoomsGuests: syncRoomsGuests,
    validateFields: validateFields
  };
})();
