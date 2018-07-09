'use strict';

(function () {
  var VALUE_ROOM_NO_GUESTS = 100;
  var VALUE_CAPACITY_NO_GUESTS = 0;
  var MAP_PIN_MAIN_WIDTH = 65;
  var MAP_PIN_MAIN_HEIGHT = 85;
  var START_PIN_MAIN_X = 570;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var form = document.querySelector('.ad-form');
  var typeField = form.querySelector('#type');
  var timeInField = form.querySelector('#timein');
  var timeOutField = form.querySelector('#timeout');
  var roomField = form.querySelector('#room_number');
  var addressField = form.querySelector('#address');
  var successMessage = document.querySelector('.success');
  var filter = map.querySelector('.map__filters');

  // словарь типов жилья и цены
  var typeToPrice = {
    flat: '1000',
    bungalo: '0',
    house: '5000',
    palace: '10000'
  };

  // поля формы .ad-form заблокированы
  var disableFields = function (value) {
    var fieldsets = form.querySelectorAll('fieldset');
    fieldsets.forEach(function (fieldset) {
      fieldset.disabled = value;
    });
  };

  // синхронизация типа жилья и цены
  var selectType = function () {
    var priceField = form.querySelector('#price');
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
    var capacityFields = form.querySelectorAll('#capacity option');

    capacityFields.forEach(function (item) {
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
  var onFormReset = function () {
    mapPinMain.style.top = (map.offsetHeight * 0.5) + 'px';
    mapPinMain.style.left = START_PIN_MAIN_X + 'px';

    map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');

    window.pin.removePins();
    window.card.removeCards();
    window.images.removeImages();
    disableFields(true);
    setTimeout(function () {
      selectType();
      syncRoomsGuests();
      setCoords();
    });
    filter.reset();
    window.map.loadPage();
  };

  form.addEventListener('reset', function () {
    onFormReset();
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
    fields.forEach(function (field) {
      field.addEventListener('invalid', function () {
        validateInput(field);
      });
      field.addEventListener('input', function () {
        validateInput(field);
      });
      form.addEventListener('reset', function () {
        field.classList.remove('ad-form__element--border-red');
      });
    });
  };

  // ошибка загрузки
  var onLoadError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 3; width: 100%; height: 100%; padding-top: 300px; text-align: center; background-color: rgba(0, 0, 0, 0.8)';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.top = 0;
    node.style.fontSize = '50px';
    node.style.color = '#ffffff';
    node.style.fontWeight = '700';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
    return node;
  };

  // скрывает сообщение об ошибке
  var showError = function (errorMessage) {
    var node = onLoadError(errorMessage);
    node.addEventListener('click', function () {
      node.classList.add('hidden');
    });

    document.addEventListener('keydown', function (evt) {
      window.utils.isEscEvent(evt, function () {
        node.classList.add('hidden');
      });
    });
  };

  // отмена действия формы по умолчанию
  form.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(form), function () {
      onFormReset();
      form.reset();
      successMessage.classList.remove('hidden');
    }, showError);
    evt.preventDefault();
  });

  // скрывает сообщение об успешной отправке формы
  successMessage.addEventListener('click', function () {
    successMessage.classList.add('hidden');
  });

  document.addEventListener('keydown', function (evt) {
    window.utils.isEscEvent(evt, function () {
      successMessage.classList.add('hidden');
    });
  });

  window.form = {
    disableFields: disableFields,
    setCoords: setCoords,
    selectType: selectType,
    syncRoomsGuests: syncRoomsGuests,
    validateFields: validateFields,
    onLoadError: onLoadError
  };
})();
