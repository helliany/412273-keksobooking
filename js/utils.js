'use strict';

(function () {
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
    return array.slice(getRandom(0, array.length - 1));
  };

  window.utils = {
    getRandom: getRandom,
    getRandomElement: getRandomElement,
    shuffleArr: shuffleArr,
    getArr: getArr,
    getRandomLength: getRandomLength
  };
})();
