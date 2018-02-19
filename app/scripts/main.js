//Angular
(function() {
  var app = angular.module("coursework", []);

  app.controller("YearController", function(){
    this.year = 4;

    this.setYear = function(value){
      this.year = value;
    };

    this.isSet = function(value){
      return this.year === value;
    };
  });

  app.controller("TeachingController", function(){
    this.teach = 4;

    this.setTeaching = function(value){
      this.teach = value;
    };

    this.isSet = function(value){
      return this.teach === value;
    };
  });
})();

//Fix for resizing on large screens in coursework page
if ($(window).innerHeight() <= 750) {
  var h = $(window).innerHeight() * (257 / 900);
  $("#fill").css("height", h);
}
else if ($(window).innerHeight() <= 970) {
  var h = $(window).innerHeight() * (400 / 900);
  $("#fill").css("height", h);
}
else {
  var h = $(window).innerHeight() * (600 / 900);
  $("#fill").css("height", h);
}

if ($(window).innerHeight() <= 750) {
  var h = $(window).innerHeight() * (100 / 900);
  $("#fill2").css("height", h);
}
else if ($(window).innerHeight() <= 970) {
  var h = $(window).innerHeight() * (200 / 900);
  $("#fill2").css("height", h);
}
else {
  var h = $(window).innerHeight() * (400 / 900);
  $("#fill2").css("height", h);
}

$(window).on('resize', function() {
  if ($(window).innerHeight() <= 750) {
    var h = $(window).innerHeight() * (257 / 900);
    $("#fill").css("height", h);
  }
  else if ($(window).innerHeight() <= 970) {
    var h = $(window).innerHeight() * (400 / 900);
    $("#fill").css("height", h);
  }
  else {
    var h = $(window).innerHeight() * (600 / 900);
    $("#fill").css("height", h);
  }

  if ($(window).innerHeight() <= 750) {
    var h = $(window).innerHeight() * (100 / 900);
    $("#fill2").css("height", h);
  }
  else if ($(window).innerHeight() <= 970) {
    var h = $(window).innerHeight() * (200 / 900);
    $("#fill2").css("height", h);
  }
  else {
    var h = $(window).innerHeight() * (400 / 900);
    $("#fill2").css("height", h);
  }
});