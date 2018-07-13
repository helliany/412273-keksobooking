'use strict';

(function () {
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;
  var MAP_PIN_MAIN_WIDTH = 65;
  var MAP_PIN_MAIN_HEIGHT = 85;
  var ESC_KEYCODE = 27;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var form = document.querySelector('.ad-form');
  var addressField = form.querySelector('#address');

  // переключение карты из неактивного состояния в активное
  var enableForm = function () {
    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    window.form.addListeners();
    window.form.disableFields(false);
    window.backend.load(window.filter.onLoadSuccess, window.form.onLoadError);
    window.form.validateFields();
    mapPinMain.removeEventListener('mouseup', enableForm);
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
      addressField.value = (mapPinMainX + Math.floor(MAP_PIN_MAIN_WIDTH * 0.5))
        + ', ' + (mapPinMainY + MAP_PIN_MAIN_HEIGHT);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // запускает один раз загрузку пинов и карточек
  var loadPage = function () {
    mapPinMain.addEventListener('mouseup', enableForm);
  };

  // форма заблокирована
  var disableForm = function () {
    window.form.disableFields(true);
    window.form.setCoords();
    window.form.selectType();
    window.form.syncRoomsGuests();
    loadPage();
  };

  // показываем карточку
  map.addEventListener('click', function (evt) {
    var evtTarget = evt.target.closest('.map__pin:not(.map__pin--main)');
    if (evtTarget) {
      closePopup();
      initializePopup(evtTarget);
    }
  });

  var initializePopup = function (mapPin) {
    if (mapPin) {
      var index = parseInt(mapPin.dataset.indexNumber, 10);
      window.card.renderCard(index);
      mapPin.classList.add('map__pin--active');
      addListeners();
    }
  };

  // прячем карточку
  var closePopup = function () {
    window.card.removeCards();
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  var addListeners = function () {
    var btnsClose = map.querySelectorAll('.popup__close');
    btnsClose.forEach(function (btnClose) {
      btnClose.addEventListener('click', closePopup);
    });
    document.addEventListener('keydown', onPopupEscPress);
  };

  disableForm();
  mapPinMain.addEventListener('mousedown', onMouseDown);

  window.map = {
    loadPage: loadPage
  };
})();
