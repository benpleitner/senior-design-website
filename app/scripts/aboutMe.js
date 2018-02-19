(function() {
  var app = angular.module("aboutMe", []);

  app.controller("YearController", function(){
    this.year = 1;

    this.setYear = function(value){
      this.year = value;
    };

    this.isSet = function(value){
      return this.year === value;
    };
  });
})();