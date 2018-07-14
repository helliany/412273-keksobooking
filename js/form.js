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
  var form = document.querySelector('.ad-form');
  var fields = document.querySelectorAll('input[required]');
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

  // поля формы и селекты фильтра заблокированы
  var disableFields = function (value) {
    var fieldsets = form.querySelectorAll('fieldset');
    var selects = filter.querySelectorAll('select');
    var fieldsetFeature = filter.querySelector('.map__features');
    fieldsets.forEach(function (fieldset) {
      fieldset.disabled = value;
    });
    selects.forEach(function (select) {
      select.disabled = value;
    });
    fieldsetFeature.disabled = value;
  };

  // синхронизация типа жилья и цены
  var selectType = function () {
    var priceField = form.querySelector('#price');
    var userType = typeField.options[typeField.selectedIndex].value;
    var userPrice = typeToPrice[userType];
    priceField.min = userPrice;
    priceField.placeholder = userPrice;
  };

  // синхронизация времени заезда и выезда
  var onTimeInChange = function () {
    timeOutField.value = timeInField.value;
  };

  var onTimeOutChange = function () {
    timeInField.value = timeOutField.value;
  };

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

  // координаты главного пина
  var setCoords = function () {
    addressField.value = (mapPinMain.offsetLeft + Math.floor(MAP_PIN_MAIN_WIDTH * 0.5))
      + ', ' + (mapPinMain.offsetTop + MAP_PIN_MAIN_HEIGHT);
  };

  // валидация инпутов
  var onInputInvalid = function (evt) {
    if (!evt.target.validity.valid) {
      evt.target.classList.add('ad-form__element--invalid');
    } else {
      evt.target.classList.remove('ad-form__element--invalid');
    }
  };

  var validateFields = function () {
    fields.forEach(function (field) {
      field.addEventListener('invalid', onInputInvalid);
      field.addEventListener('input', onInputInvalid);
    });
  };

  // убрать рамки и обработчики событий с инпутов
  var removeFieldsState = function () {
    fields.forEach(function (field) {
      field.removeEventListener('invalid', onInputInvalid);
      field.removeEventListener('input', onInputInvalid);
      field.classList.remove('ad-form__element--invalid');
    });
  };

  // сообщение об ошибке загрузки
  var onLoadError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 3; width: 100%; height: 100%; padding-top: 300px; text-align: center; background-color: rgba(0, 0, 0, 0.8)';
    node.style.position = 'fixed';
    node.style.left = '0';
    node.style.top = '0';
    node.style.fontSize = '50px';
    node.style.color = '#ffffff';
    node.style.fontWeight = '700';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
    return node;
  };

  // скрываемое сообщение об ошибке загрузки
  var showErrorMsg = function (errorMessage) {
    var node = onLoadError(errorMessage);
    var onErrorClick = function () {
      node.remove();
      document.removeEventListener('click', onErrorClick);
      document.removeEventListener('keydown', onErrorEscPress);
    };

    var onErrorEscPress = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        onErrorClick();
      }
    };

    document.addEventListener('click', onErrorClick);
    document.addEventListener('keydown', onErrorEscPress);
  };

  // показывает сообщение об успешной отправке формы
  var showSuccessMsg = function () {
    successMessage.classList.remove('hidden');
    successMessage.addEventListener('click', onSuccessClick);
    document.addEventListener('keydown', onSuccessEscPress);
  };

  // скрывает сообщение об успешной отправке формы
  var onSuccessClick = function () {
    successMessage.classList.add('hidden');
    successMessage.removeEventListener('click', onSuccessClick);
    document.removeEventListener('keydown', onSuccessEscPress);
  };

  var onSuccessEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      onSuccessClick();
    }
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
    removeFieldsState();
    disableFields(true);
    setTimeout(function () {
      selectType();
      syncRoomsGuests();
      setCoords();
    });
    filter.reset();
    removeListeners();
    window.map.loadPage();
  };

  // отмена действия формы по умолчанию, отправка формы
  var onFormSubmit = function (evt) {
    window.backend.save(new FormData(form), function () {
      onFormReset();
      form.reset();
      showSuccessMsg();
    }, showErrorMsg);
    evt.preventDefault();
  };

  // добавить обработчики событий на форму
  var addListeners = function () {
    typeField.addEventListener('change', selectType);
    timeInField.addEventListener('change', onTimeInChange);
    timeOutField.addEventListener('change', onTimeOutChange);
    roomField.addEventListener('change', syncRoomsGuests);
    form.addEventListener('reset', onFormReset);
    form.addEventListener('submit', onFormSubmit);
    window.images.addListeners();
  };

  // удалить обработчики событий с формы
  var removeListeners = function () {
    typeField.removeEventListener('change', selectType);
    timeInField.removeEventListener('change', onTimeInChange);
    timeOutField.removeEventListener('change', onTimeOutChange);
    roomField.removeEventListener('change', syncRoomsGuests);
    form.removeEventListener('reset', onFormReset);
    form.removeEventListener('submit', onFormSubmit);
    window.images.removeListeners();
  };

  window.form = {
    addListeners: addListeners,
    disableFields: disableFields,
    setCoords: setCoords,
    selectType: selectType,
    syncRoomsGuests: syncRoomsGuests,
    validateFields: validateFields,
    onLoadError: onLoadError
  };
})();
