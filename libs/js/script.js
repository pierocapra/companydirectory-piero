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
            $("#depList").append(`<li>
            <div class="deploc-cell">
            <h3 class="dep-name">${temp[department]["name"]}</h3>
            </div>
            </li>`);
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
            $("#locList").append(`<li>
            <div class="deploc-cell">
              <h3 class="dep-name">${temp[location]["name"]}</h3>
            </div>
          </li>`);
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
      url: "libs/php/getAllPersonnel.php",
      type: "GET",
      success: function (result) {
        // console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          $.each(temp, (person) => {
            const initial = "#" + temp[person]["lastName"][0].toLowerCase();
            console.log(initial);
            $(initial).append(`<li>
                <div class="name-cell">
                  <h3 class="name">${
                    temp[person]["lastName"] + " " + temp[person]["firstName"]
                  }</h3>
                </div>
              </li>`);
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

{
  /* <li>
  <div class="name-cell">
    <h3 class="name">Abril Jose</h3>
  </div>
</li> */
}
