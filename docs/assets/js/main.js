$(document).ready(function(){
  var img_src = "http://placehold.it/800x600"
  if (navigator.userAgent.search("MSIE") >= 0) {
    img_src = "http://lorempixel.com/output/nightlife-q-g-800-600-6.jpg"
  }
  else if (navigator.userAgent.search("Chrome") >= 0) {
      img_src = "http://lorempixel.com/output/food-q-g-800-600-7.jpg"
  }
  else if (navigator.userAgent.search("Firefox") >= 0) {
      img_src = "http://lorempixel.com/output/sports-q-g-800-600-10.jpg"
  }
  else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
      img_src = "http://lorempixel.com/output/technics-q-g-800-600-4.jpg"
  }
  else if (navigator.userAgent.search("Opera") >= 0) {
      img_src = "http://lorempixel.com/output/nightlife-q-g-800-600-5.jpg"
  }
  $("#screenshot").attr("src", img_src);
});
