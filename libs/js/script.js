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

            //POPULATE THE DEPARTMENT LIST
            $("#depList").append(`<li class="deploc-cell depCell-${depId}"}>
              <h3 class="deploc-name">${depName}</h3>
            </li>`);

            //POPULATE THE DROPDOWN MENU IN ADD NEW EMPLOYEE
            $("#addDep").append(`<option value="${depId}">${depName}</option>`);

            //HIGHLIGHT SELECTION ON CLICK
            $(`.depCell-${depId}`).on("click", () => {
              if (!highlighted) {
                $(`.depCell-${depId}`).addClass("highlight-selection");
                highlighted = true;
                $(`.depCell-${depId}`)
                  .siblings()
                  .removeClass("highlight-selection");

                //update selection bar
                $("#selectionResearch").html(`department: ${depName}`);
                $(".selection-par").css(
                  "backgroundColor",
                  "var(--secondary-color)"
                );

                //Label agenda
                $(".label-agenda").css("width", "30px");

                retrievePersonnelByDepartment(depId);
              } else {
                $(`.depCell-${depId}`).removeClass("highlight-selection");
                highlighted = false;

                //update selection bar
                $("#selectionResearch").html(`personnel: All`);
                $(".selection-par").css(
                  "backgroundColor",
                  "var(--primary-color)"
                );

                //Label agenda
                $(".label-agenda").css("width", "40px");

                retrievePersonnel();
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

            //POPULATE THE LOCATIONS LIST
            $("#locList").append(`<li class="deploc-cell locCell-${locId}"}>
              <h3 class="deploc-name">${locName}</h3>
            </li>`);

            //HIGHLIGHT SELECTION ON CLICK
            $(`.locCell-${locId}`).on("click", () => {
              if (!highlighted) {
                $(`.locCell-${locId}`).addClass("highlight-selection");
                $(`.locCell-${locId}`)
                  .siblings()
                  .removeClass("highlight-selection");

                highlighted = true;

                //update selection bar
                $("#selectionResearch").html(`location: ${locName}`);
                $(".selection-par").css(
                  "backgroundColor",
                  "var(--tertiary-color)"
                );

                //Label agenda
                $(".label-agenda").css("width", "30px");

                retrievePersonnelByLocation(locId);
              } else {
                $(`.locCell-${locId}`).removeClass("highlight-selection");
                highlighted = false;

                //update selection bar
                $("#selectionResearch").html(`personnel: All`);
                $(".selection-par").css(
                  "backgroundColor",
                  "var(--primary-color)"
                );

                //Label agenda
                $(".label-agenda").css("width", "40px");

                retrievePersonnel(`.locCell-${locId}`);
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

  const retrievePersonnel = function () {
    $.ajax({
      url: "libs/php/getAll.php",
      type: "GET",
      success: function (result) {
        console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          getPersonInfo(temp);
        }
      },
      error: function (result, a, e) {
        alert("Error! Cannot retrieve locations");
      },
    });
  };

  const retrievePersonnelByDepartment = function (depId) {
    $.ajax({
      url: "libs/php/getAllByDep.php",
      type: "POST",
      data: {
        depId: depId,
      },
      success: function (result) {
        console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          getPersonInfo(temp);
        }
      },
      error: function (result, a, e) {
        alert("Error! Cannot retrieve locations");
      },
    });
  };

  const retrievePersonnelByLocation = function (locId) {
    $.ajax({
      url: "libs/php/getAllByLoc.php",
      type: "POST",
      data: {
        locId: locId,
      },
      success: function (result) {
        console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          getPersonInfo(temp);
        }
      },
      error: function (result, a, e) {
        alert("Error! Cannot retrieve locations");
      },
    });
  };

  const retrievePersonnelBySearch = function (substr) {
    $.ajax({
      url: "libs/php/getAllBySearch.php",
      type: "POST",
      data: {
        substr: substr,
      },
      success: function (result) {
        console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          //update selection bar
          $("#selectionResearch").html(`personnel: ${substr}`);
          if (!substr) {
            $("#selectionResearch").html(`personnel: All`);
          }

          getPersonInfo(temp);
        }
      },
      error: function (result, a, e) {
        alert("Error! Cannot retrieve locations");
      },
    });
  };

  const getPersonInfo = (temp) => {
    // clear list first
    $(".names-container").html("");

    let initial = "";

    $.each(temp, (person) => {
      const lName = temp[person]["lastName"];
      const fName = temp[person]["firstName"];
      const email = temp[person]["email"];
      const personId = temp[person]["id"];
      const jobTitle = temp[person]["jobTitle"];
      const department = temp[person]["department"];
      const location = temp[person]["location"];

      //Populated List of names alphabetically
      const initialTemp = lName[0].toUpperCase();

      if (initialTemp != initial) {
        $("#name-container").append(
          `</ul><div class="letter">${initialTemp}</div><ul id="${initialTemp}">`
        );
        initial = initialTemp;
      }

      // </ul>
      $("#name-container")
        .append(`<li class="name-cell" id="person-${personId}">
            <h3 class="name">${lName + " " + fName}</h3>
        </li>`);

      //Show Informations in the card
      $(`#person-${personId}`).on("click", () => {
        $("#cityImage").html(`<img
        src="img/${location}.jpg"
        alt="City Image"
        class="city-image"
      />`);
        $("#infoName").html(fName + " " + lName);
        $("#email").html(email);
        $("#jobTitle").html(jobTitle);
        $("#department").html(department);
        $("#location").html(location);
      });
    });
  };

  const insertNewPerson = (addfname, addlname, addemail, addjob, addDep) => {
    $.ajax({
      url: "libs/php/insertPerson.php",
      type: "POST",
      data: {
        firstName: addfname,
        lastName: addlname,
        email: addemail,
        jobTitle: addjob,
        departmentID: addDep,
      },
      success: function (result) {
        //clear fields once inserted
        $("#addfname").val(""),
          $("#addlname").val(""),
          $("#addemail").val(""),
          $("#addjob").val("");
      },
      error: function (result, a, e) {
        alert("Error! Cannot Insert New person!");
      },
    });
  };

  ////////////////////RETRIEVE DATA ON OPENING/////////////////////////////////
  retrieveDepartments();
  retrieveLocations();
  retrievePersonnel();

  $("#formAddEmployee").submit(function (e) {
    e.preventDefault();

    insertNewPerson(
      $("#addfname").val(),
      $("#addlname").val(),
      $("#addemail").val(),
      $("#addjob").val(),
      $("#addDep").val()
    );

    console.log($("#addDep").val());

    // clearfields
    $("#addfname").val("");
    $("#addlname").val("");
    $("#addemail").val("");
    $("#addjob").val("");
    $("#addDep").val("");

    //reload personnel
    retrievePersonnel();
  });

  //clear the search input
  $("#searchInput").val("");

  ///////////////////LOAD agenda by SEARCH
  $("#searchInput").keyup(function () {
    retrievePersonnelBySearch($("#searchInput").val());
  });

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
