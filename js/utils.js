'use strict';

(function () {
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

  window.utils = {
    shuffleArr: shuffleArr
  };
})();
