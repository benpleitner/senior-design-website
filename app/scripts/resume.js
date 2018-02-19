(function() {
  var app = angular.module("resume", []);

  app.controller("TranscriptController", function(){
    this.click = 1;

    this.addClick = function() {
      this.click++;
    };

    this.isEven = function() {
      return (this.click % 2) == 0;
    };
  });
})();

var h = $(window).innerHeight() * (32 / 100);
$("#resume").css("padding-top", h);

$(window).on('resize', function() {
  var h = $(window).innerHeight() * (32 / 100);
  $("#resume").css("padding-top", h);
});