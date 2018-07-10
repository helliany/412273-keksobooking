'use strict';

(function () {
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;
  var MAP_PIN_MAIN_WIDTH = 65;
  var MAP_PIN_MAIN_HEIGHT = 85;

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
      addressField.value = (mapPinMainX + Math.floor(MAP_PIN_MAIN_WIDTH * 0.5)) + ', ' + (mapPinMainY + MAP_PIN_MAIN_HEIGHT);
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
    var evtTarget = evt.target;
    var evtTargetParent = evt.target.parentNode;
    if (evtTarget.classList.contains('map__pin') || evtTargetParent.classList.contains('map__pin')) {
      initializePopup(evtTarget);
      initializePopup(evtTargetParent);
    }
  });

  var initializePopup = function (evtTarget) {
    var mapPins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPins.forEach(function (item, index) {
      if (item === evtTarget) {
        window.card.renderCard(index);
        item.classList.add('map__pin--active');
      }
    });
    closePopup();
  };

  var onPopupEscPress = function (evt) {
    window.utils.isEscEvent(evt, window.card.removeCards);
  };

  // прячем карточку
  var closePopup = function () {
    var btnsClose = map.querySelectorAll('.popup__close');
    var mapPins = map.querySelectorAll('.map__pin:not(.map__pin--main)');

    // прячем по клику/enter на пине
    mapPins.forEach(function (item) {
      item.addEventListener('click', window.card.removeCards);

      item.addEventListener('keydown', function (evt) {
        window.utils.isEnterEvent(evt, window.card.removeCards);
      });
    });

    // прячем по клику/enter на кнопке, esc
    btnsClose.forEach(function (btnClose) {
      btnClose.addEventListener('click', window.card.removeCards);

      btnClose.addEventListener('keydown', function (evt) {
        window.utils.isEnterEvent(evt, window.card.removeCards);
      });
    });

    document.addEventListener('keydown', onPopupEscPress);
  };

  disableForm();
  mapPinMain.addEventListener('mousedown', onMouseDown);

  window.map = {
    loadPage: loadPage
  };
})();
