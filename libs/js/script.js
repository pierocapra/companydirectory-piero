"use strict";
///////////////////////////////DATABASE/////////////////////////////////////////

/////////////////////////POPULATE WEBSITE DATA ON LOAD////////////////////////
$(document).ready(function () {
  const retrieveDepartments = function () {
    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: "GET",
      success: function (result) {
        // console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          $.each(temp, (department) => {
            const depName = temp[department]["name"];
            const depId = temp[department]["id"];
            let highlighted = false;

            //POPULATE THE LIST
            $("#depList").append(`<li class="deploc-cell depCell-${depId}"}>
              <h3 class="deploc-name">${depName}</h3>
            </li>`);

            //HIGHLIGHT SELECTION ON CLICK
            $(`.depCell-${depId}`).on("click", () => {
              if (!highlighted) {
                $(`.depCell-${depId}`).addClass("highlight-selection");
                highlighted = true;
              } else {
                $(`.depCell-${depId}`).removeClass("highlight-selection");
                highlighted = false;
              }
            });
          });
        }
      },
      error: function (result, a, e) {
        alert("Error! Cannot retrieve departments!");
      },
    });
  };
  retrieveDepartments();

  const retrieveLocations = function () {
    $.ajax({
      url: "libs/php/getAllLocations.php",
      type: "GET",
      success: function (result) {
        // console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          $.each(temp, (location) => {
            const locName = temp[location]["name"];
            const locId = temp[location]["id"];
            let highlighted = false;

            //POPULATE THE LIST
            $("#locList").append(`<li class="deploc-cell locCell-${locId}"}>
              <h3 class="deploc-name">${locName}</h3>
            </li>`);

            //HIGHLIGHT SELECTION ON CLICK
            $(`.locCell-${locId}`).on("click", () => {
              if (!highlighted) {
                $(`.locCell-${locId}`).addClass("highlight-selection");
                highlighted = true;
              } else {
                $(`.locCell-${locId}`).removeClass("highlight-selection");
                highlighted = false;
              }
            });
          });
        }
      },
      error: function (result, a, e) {
        alert("Error! Cannot retrieve locations");
      },
    });
  };
  retrieveLocations();

  const retrievePersonnel = function () {
    $.ajax({
      url: "libs/php/getAll.php",
      type: "GET",
      success: function (result) {
        console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          $.each(temp, (person) => {
            const lName = temp[person]["lastName"];
            const fName = temp[person]["firstName"];
            const personId = temp[person]["id"];
            const initial = "#" + lName[0].toLowerCase();

            $(initial).append(`<li class="name-cell" id="person-${personId}">
                  <h3 class="name">${lName + " " + fName}</h3>
              </li>`);

            $(`#person-${personId}`).on("click", () => {
              $("#infoName").html(fName + " " + lName);
              $("#email").html(temp[person]["email"]);
              $("#jobTitle").html(temp[person]["jobTitle"]);
              $("#department").html(temp[person]["department"]);
              $("#location").html(temp[person]["location"]);
            });
          });
        }
      },
      error: function (result, a, e) {
        alert("Error! Cannot retrieve locations");
      },
    });
  };
  retrievePersonnel();

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////ACTIONS AND ANIMATIONS////////////////////////////////////////////////////////////////////////////

  //LABELS animations
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
