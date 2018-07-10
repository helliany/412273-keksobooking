'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var AVATAR_SRC = 'img/muffin-grey.svg';

  var form = document.querySelector('.ad-form');
  var avatarDropZone = form.querySelector('.ad-form-header__drop-zone');
  var avatarChooser = form.querySelector('.ad-form-header__input');
  var avatarPreview = form.querySelector('.ad-form-header__preview img');
  var photoContainer = form.querySelector('.ad-form__photo-container');
  var photoDropZone = photoContainer.querySelector('.ad-form__drop-zone');
  var photoChooser = photoContainer.querySelector('.ad-form__upload input[type=file]');
  var photoPreview = photoContainer.querySelector('.ad-form__photo');

  // проверяет соответствие загружаемого файла
  var matchFileType = function (file, action) {
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      action(reader);
    }
  };

  // выбор файла перетаскиванием
  var onZoneDragOver = function (evt) {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  };

  var onZoneDrop = function (evt, action) {
    evt.preventDefault();
    var file = evt.dataTransfer.files[0];
    action(file);
  };

  // загрузка аватарки
  var loadAvatar = function (file) {
    matchFileType(file, function (reader) {
      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });
    });
  };

  // загрузка фото жилья
  var loadPhoto = function (file) {
    matchFileType(file, function (reader) {
      photoPreview.classList.remove('ad-form__photo--main');
      reader.addEventListener('load', function () {
        var photoPreviewNode = photoPreview.cloneNode(true);
        photoPreviewNode.insertAdjacentHTML('beforeend', '<img src="' + reader.result + '" width="70" height="70" alt="Фотография жилья">');
        photoContainer.appendChild(photoPreviewNode);
      });
    });
  };

  var onAvatarInputChange = function (evt) {
    var file = evt.target.files[0];
    loadAvatar(file);
  };

  var onPhotoInputChange = function (evt) {
    var file = evt.target.files[0];
    loadPhoto(file);
  };

  var onAvatarZoneDrop = function (evt) {
    onZoneDrop(evt, loadAvatar);
  };

  var onPhotoZoneDrop = function (evt) {
    onZoneDrop(evt, loadPhoto);
  };

  // добавить обработчики событий на поля загрузки
  var addListeners = function () {
    avatarChooser.addEventListener('change', onAvatarInputChange);
    avatarDropZone.addEventListener('dragover', onZoneDragOver);
    avatarDropZone.addEventListener('drop', onAvatarZoneDrop);

    photoChooser.addEventListener('change', onPhotoInputChange);
    photoDropZone.addEventListener('dragover', onZoneDragOver);
    photoDropZone.addEventListener('drop', onPhotoZoneDrop);
  };

  // удалить обработчики событий с полей загрузки
  var removeListeners = function () {
    avatarChooser.removeEventListener('change', onAvatarInputChange);
    avatarDropZone.removeEventListener('dragover', onZoneDragOver);
    avatarDropZone.removeEventListener('drop', onAvatarZoneDrop);

    photoChooser.removeEventListener('change', onPhotoInputChange);
    photoDropZone.removeEventListener('dragover', onZoneDragOver);
    photoDropZone.removeEventListener('drop', onPhotoZoneDrop);
  };

  // удаление файлов
  var removeImages = function () {
    photoPreview.classList.add('ad-form__photo--main');
    avatarPreview.src = AVATAR_SRC;
    var photos = photoContainer.querySelectorAll('.ad-form__photo:not(.ad-form__photo--main)');
    photos.forEach(function (item) {
      item.remove();
    });
  };

  window.images = {
    addListeners: addListeners,
    removeListeners: removeListeners,
    removeImages: removeImages
  };
})();
