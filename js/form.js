'use strict';

(function () {
  var VALUE_ROOM_NO_GUESTS = 100;
  var VALUE_CAPACITY_NO_GUESTS = 0;
  var MAP_PIN_MAIN_WIDTH = 65;
  var MAP_PIN_MAIN_HEIGHT = 85;
  var START_PIN_MAIN_X = 570;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var adFieldset = adForm.querySelectorAll('fieldset');
  var typeField = adForm.querySelector('#type');
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var roomField = adForm.querySelector('#room_number');
  var addressField = adForm.querySelector('#address');
  // словарь типов жилья и цены
  var typeToPrice = {
    flat: '1000',
    bungalo: '0',
    house: '5000',
    palace: '10000'
  };

  // поля формы .ad-form заблокированы
  var disableFieldset = function () {
    for (var i = 0; i < adFieldset.length; i++) {
      adFieldset[i].disabled = true;
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

  // сброс формы, координат главного пина
  var onAdFormReset = function () {
    mapPinMain.style.top = (map.offsetHeight * 0.5) + 'px';
    mapPinMain.style.left = START_PIN_MAIN_X + 'px';
    setTimeout(function () {
      selectType();
      syncRoomsGuests();
      setCoords();
    });
  };

  adForm.addEventListener('reset', function () {
    onAdFormReset();
  });

  window.form = {
    disableFieldset: disableFieldset,
    setCoords: setCoords,
    selectType: selectType,
    syncRoomsGuests: syncRoomsGuests
  };
})();
