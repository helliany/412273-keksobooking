'use strict';

(function () {
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;
  var MAP_PIN_MAIN_WIDTH = 65;
  var MAP_PIN_MAIN_HEIGHT = 85;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var form = document.querySelector('.ad-form');
  var addressField = form.querySelector('#address');

  // переключение карты из неактивного состояния в активное
  var enableForm = function () {
    var mapPins = map.querySelectorAll('.map__pin');

    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    window.form.disableFields(false);

    mapPins.forEach(function (pin) {
      pin.classList.remove('hidden');
    });

    initializePopup(mapPins);
    window.form.validateFields();
  };

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

      enableForm();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    onMouseDown(evt);
  });

  // форма заблокирована
  var disableForm = function () {
    window.form.disableFields(true);
    window.pin.loadElements();
    window.card.loadElements();
    window.form.setCoords();
    window.form.selectType();
    window.form.syncRoomsGuests();
  };

  disableForm();

  // показываем карточку
  var openCard = function (evt, index) {
    var mapCards = map.querySelectorAll('.map__card');
    window.form.hideCards();

    if (!evt.currentTarget.matches('.map__pin--main')) {
      mapCards[index - 1].classList.remove('hidden');
    }
  };

  var initializePopup = function (mapPins) {
    var btnsClose = map.querySelectorAll('.popup__close');

    // показываем по клику/enter на пине
    mapPins.forEach(function (item, index) {
      item.addEventListener('click', function (evt) {
        openCard(evt, index);
        evt.currentTarget.classList.add('map__pin--active');
      });

      item.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          openCard(evt, index);
          evt.currentTarget.classList.add('map__pin--active');
        }
      });
    });

    // прячем по клику/enter на кнопке, esc
    btnsClose.forEach(function (btnClose) {
      btnClose.addEventListener('click', function () {
        window.form.hideCards();
      });

      btnClose.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          window.form.hideCards();
        }
      });

      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          window.form.hideCards();
        }
      });
    });
  };
})();
