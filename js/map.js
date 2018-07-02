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
  var adForm = document.querySelector('.ad-form');
  var addressField = adForm.querySelector('#address');

  // переключение карты из неактивного состояния в активное
  var enableForm = function () {
    var mapPin = map.querySelectorAll('.map__pin');

    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.form.disableFieldset(false);

    for (var j = 0; j < mapPin.length; j++) {
      mapPin[j].classList.remove('hidden');
    }

    initializePopup();
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
  };

  // форма заблокирована
  var disableForm = function () {
    window.form.disableFieldset(true);
    window.backend.load(window.pin.addElements, errorHandler);
    window.backend.load(window.card.addElements, errorHandler);
    window.form.setCoords();
    window.form.selectType();
    window.form.syncRoomsGuests();
  };

  disableForm();

  // показываем карточку
  var openCard = function (evt, index) {
    var mapCard = map.querySelectorAll('.map__card');
    window.form.hideCard();

    if (!evt.currentTarget.matches('.map__pin--main')) {
      mapCard[index - 1].classList.remove('hidden');
    }
  };

  var initializePopup = function () {
    var mapPin = map.querySelectorAll('.map__pin');
    var btnPopupClose = map.querySelectorAll('.popup__close');

    // показываем по клику/enter на пине
    mapPin.forEach(function (mapItem, index) {
      mapItem.addEventListener('click', function (evt) {
        openCard(evt, index);
        evt.currentTarget.classList.add('map__pin--active');
      });

      mapItem.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          openCard(evt, index);
          evt.currentTarget.classList.add('map__pin--active');
        }
      });
    });

    // прячем по клику/enter на кнопке, esc
    btnPopupClose.forEach(function (btnCloseItem) {
      btnCloseItem.addEventListener('click', function () {
        window.form.hideCard();
      });

      btnCloseItem.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          window.form.hideCard();
        }
      });

      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          window.form.hideCard();
        }
      });
    });
  };
})();
