"use strict";
$(document).ready(function () {
  $("#btnDep").on("click", () => {
    $("#depSection").css("transform", "translateX(0)");
    $("#locSection").css("transform", "translateX(-110%)");
    $("#btnDep").css("width", "40px");
    $("#btnLoc").css("width", "30px");
  });
  $("#btnLoc").on("click", () => {
    $("#depSection").css("transform", "translateX(-110%)");
    $("#locSection").css("transform", "translateX(0)");
    $("#btnDep").css("width", "30px");
    $("#btnLoc").css("width", "40px");
  });
});
