"use strict";

////////////////////////GLOBAL VARIABLES/////////////////////////////////////
let currentPersonID = "";

let depSlided = true;
let locSlided = false;

//SET department variable according to MEDIA QUERY
const setDepSlideVar = (x) => {
  if (x.matches) {
    depSlided = false;
  }
};

let x = window.matchMedia("(max-width: 51.25em)");
setDepSlideVar(x); // Call listener function at run time
x.addListener(setDepSlideVar); // Attach listener function on state changes

//REMOVE TOOLTIPS ON TOUCH
const removeTooltip = (y) => {
  if (y.matches) {
    for (let index = 1; index <= 10; index++) {
      const tooltip = document.querySelector(`.tooltip${index}`);
      tooltip.removeAttribute("uk-tooltip");
    }
  }
};

let y = window.matchMedia("(hover: none)");
removeTooltip(y); // Call listener function at run time
y.addListener(removeTooltip); // Attach listener function on state changes

///////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
  //////PRELOADER
  $(window).on("load", function () {
    $("#preloader").length &&
      $("#preloader")
        .delay(100)
        .fadeOut("slow", function () {
          $(this).remove();
        });
  });

  //////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////DATABASE/////////////////////////////////////////

  const retrieveDepartments = function () {
    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: "GET",
      success: function (result) {
        // console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          //clear fields
          $("#depList").html("");
          $("#addDep").html("");
          $("#editDep").html("");
          $("#deleteDep").html("");

          $.each(temp, (department) => {
            const depName = temp[department]["name"];
            const depId = temp[department]["id"];
            // let highlighted = false;

            //POPULATE THE DEPARTMENT LIST
            $("#depList").append(`<li class="deploc-cell depCell-${depId}"}>
              <h3 class="deploc-name">${depName}</h3>
            </li>`);

            //POPULATE THE DROPDOWN MENU IN ADD NEW EMPLOYEE
            $("#addDep").append(`<option value="${depId}">${depName}</option>`);

            //POPULATE THE DROPDOWN MENU IN EDIT EMPLOYEE
            $("#editDep").append(
              `<option value="${depId}">${depName}</option>`
            );

            //POPULATE THE DROPDOWN MENU IN DELETE DEPARTMENT WINDOW
            $("#deleteDep").append(
              `<option value="${depId}">${depName}</option>`
            );

            //HIGHLIGHT SELECTION ON CLICK
            $(`.depCell-${depId}`).on("click", () => {
              //update selection bar
              $("#selectionResearch").html(`department: ${depName}`);
              $(".selection-par").css(
                "backgroundColor",
                "var(--secondary-color)"
              );
              //Label agenda
              $(".label-agenda").css("width", "45px");

              retrievePersonnelByDepartment(depId);

              //clear the search input
              $("#searchInput").val("");

              //close section and reset buttons
              $("#depSection").css("transform", "translateX(-110%)");
              $("#btnDep").css("width", "45px");
              depSlided = false;
            });
          });
        }
      },
      error: function (result, a, e) {
        $("#alertMessage").html("Error! Cannot retrieve departments!");
        UIkit.modal("#alertModal").show();
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

          // clear fields
          $("#locList").html("");
          $("#addLoc").html("");

          $("#deleteLoc").html("");

          $.each(temp, (location) => {
            const locName = temp[location]["name"];
            const locId = temp[location]["id"];
            // let highlighted = false;

            //POPULATE THE LOCATIONS LIST
            $("#locList").append(`<li class="deploc-cell locCell-${locId}"}>
              <h3 class="deploc-name">${locName}</h3>
            </li>`);

            //POPULATE THE DROPDOWN MENU IN ADD NEW LOCATION
            $("#addLoc").append(`<option value="${locId}">${locName}</option>`);

            //POPULATE THE DROPDOWN MENU IN DELETE DEPARTMENT WINDOW
            $("#deleteLoc").append(
              `<option value="${locId}">${locName}</option>`
            );

            //HIGHLIGHT SELECTION ON CLICK
            $(`.locCell-${locId}`).on("click", () => {
              //update selection bar
              $("#selectionResearch").html(`location: ${locName}`);
              $(".selection-par").css(
                "backgroundColor",
                "var(--tertiary-color)"
              );

              //Label agenda
              $(".label-agenda").css("width", "45px");

              retrievePersonnelByLocation(locId);

              //clear the search input
              $("#searchInput").val("");

              //close section and reset buttons
              $("#locSection").css("transform", "translateX(-110%)");
              $("#btnLoc").css("width", "45px");
              locSlided = false;
            });
          });
        }
      },
      error: function (result, a, e) {
        $("#alertMessage").html("Error! Cannot retrieve locations!");
        UIkit.modal("#alertModal").show();
      },
    });
  };

  const retrievePersonnel = function () {
    $.ajax({
      url: "libs/php/getAll.php",
      type: "GET",
      success: function (result) {
        // console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          getPersonInfo(temp);
        }
      },
      error: function (result, a, e) {
        $("#alertMessage").html("Error! Cannot retrieve Personnel!");
        UIkit.modal("#alertModal").show();
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
        // console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          getPersonInfo(temp);
        }
      },
      error: function (result, a, e) {
        $("#alertMessage").html(
          "Error! Cannot retrieve Personnel by Department!"
        );
        UIkit.modal("#alertModal").show();
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
        // console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          getPersonInfo(temp);
        }
      },
      error: function (result, a, e) {
        $("#alertMessage").html(
          "Error! Cannot retrieve Personnel by Location!"
        );
        UIkit.modal("#alertModal").show();
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
        // console.log(result["data"]);

        if (result.status.name == "ok") {
          const temp = result["data"];

          //update selection bar
          $("#selectionResearch").html(`personnel: ${substr}`);
          $(".selection-par").css("backgroundColor", "var(--primary-color)");

          if (!substr) {
            $("#selectionResearch").html("personnel: All");
          }

          getPersonInfo(temp);
        }
      },
      error: function (result, a, e) {
        $("#alertMessage").html("Error! Cannot retrieve Personnel by Search!");
        UIkit.modal("#alertModal").show();
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
      const depID = temp[person]["depID"];
      const department = temp[person]["department"];
      const location = temp[person]["location"];

      //Populated List of names alphabetically
      const initialTemp = lName[0].toUpperCase();

      if (initialTemp != initial) {
        $("#name-container").append(
          `</ul><div class="letter" >${initialTemp}</div><ul id="${initialTemp}">`
        );
        initial = initialTemp;
      }

      // </ul>
      $("#name-container")
        .append(`<li class="name-cell" id="person-${personId}">
            <h3 class="name">${
              lName + ", " + fName
            }</h3><h4 class="inline-department">${department}</h4><h4 class="inline-location">${location}</h4>
        </li>`);

      //Show Informations in the card
      $(`#person-${personId}`).on("click", () => {
        if (
          location == "London" ||
          location == "New York" ||
          location == "Paris" ||
          location == "Munich" ||
          location === "Rome"
        ) {
          $("#cityImage").html(`<img
          src="img/${location}.jpg"
          alt="City Image"
          class="city-image "
        />`);
        } else {
          $("#cityImage").html(`<img
          src="img/skyline-silhouette.jpg"
          alt="City Image"
          class="city-image "
        />`);
        }
        $("#infoName").html(fName + " " + lName);
        $("#email").html(email);
        $("#jobTitle").html(jobTitle);
        $("#department").html(department);
        $("#location").html(location);

        currentPersonID = personId;

        //Show info in the Edit Modal
        $("#editfname").attr("placeholder", fName);
        $("#editlname").attr("placeholder", lName);
        $("#editemail").attr("placeholder", email);
        $("#editjob").attr("placeholder", jobTitle);
        $("#editDep").prepend(
          `<option value=${depID} class="placeholder-look" selected>${department}</option>`
        );
        $("#secPersoninfo").css("transform", "translateX(0)");

        //close sections dep and loc and reset buttons
        $("#depSection").css("transform", "translateX(-110%)");
        $("#btnDep").css("width", "45px");
        depSlided = false;

        $("#locSection").css("transform", "translateX(-110%)");
        $("#btnLoc").css("width", "45px");
        locSlided = false;
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
        //UPDATE INFO IN PERSON WINDOW
        let location = result["data"]["location"];
        if (
          location == "London" ||
          location == "New York" ||
          location == "Paris" ||
          location == "Munich" ||
          location === "Rome"
        ) {
          $("#cityImage").html(`<img
          src="img/${location}.jpg"
          alt="City Image"
          class="city-image "
        />`);
        } else {
          $("#cityImage").html(`<img
          src="img/skyline-silhouette.jpg"
          alt="City Image"
          class="city-image "
        />`);
        }

        $("#infoName").html(addfname + " " + addlname);
        $("#email").html(addemail);
        $("#jobTitle").html(addjob);

        $("#department").html(result["data"]["department"]);
        $("#location").html(location);

        UIkit.notification({
          message: "NEW EMPLOYEE SUCCESSFULLY ADDED!",
          status: "primary",
          pos: "top-right",
          timeout: 4000,
        });

        //reload personnel
        retrievePersonnel();
      },
      error: function (result, a, e) {
        $("#alertMessage").html("Error! Cannot Insert a new employee!");
        UIkit.modal("#alertModal").show();
      },
    });
  };

  const insertNewDepartment = (name, locationID) => {
    //check if the department already exists
    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: "GET",
      success: function (result) {
        // console.log(result["data"]);
        let departmentExist = false;

        if (result.status.name == "ok") {
          const temp = result["data"];

          $.each(temp, (department) => {
            if (
              temp[department]["name"].toLowerCase() ===
              name.trim().toLowerCase()
            ) {
              departmentExist = true;
            }
          });
        }

        if (departmentExist === false) {
          //if doesn't exist can be added
          $.ajax({
            url: "libs/php/insertDepartment.php",
            type: "POST",
            data: {
              name: name.trim(),
              locationID: locationID,
            },
            success: function (result) {
              // console.log(result);
              UIkit.notification({
                message: "NEW DEPARTMENT SUCCESSFULLY ADDED!",
                status: "primary",
                pos: "top-right",
                timeout: 4000,
              });

              //reload departments
              retrieveDepartments();
            },
            error: function (result, a, e) {
              $("#alertMessage").html("Error! Cannot insert a new department!");
              UIkit.modal("#alertModal").show();
            },
          });
        } else {
          $("#alertMessage").html("This department already exist!");
          UIkit.modal("#alertModal").show();
        }
      },
      error: function (result, a, e) {
        $("#alertMessage").html("Error! Cannot insert a new department!");
        UIkit.modal("#alertModal").show();
      },
    });
  };

  const insertNewLocation = (name) => {
    //check if location already exist
    $.ajax({
      url: "libs/php/getAllLocations.php",
      type: "GET",
      success: function (result) {
        // console.log(result["data"]);
        let locationExist = false;

        if (result.status.name == "ok") {
          const temp = result["data"];

          $.each(temp, (location) => {
            if (
              temp[location]["name"].toLowerCase() === name.trim().toLowerCase()
            ) {
              locationExist = true;
            }
          });
        }

        if (locationExist === false) {
          //if it doesn't can be added
          $.ajax({
            url: "libs/php/insertLocation.php",
            type: "POST",
            data: {
              name: name.trim(),
            },
            success: function (result) {
              // console.log(result);
              UIkit.notification({
                message: "NEW LOCATION SUCCESSFULLY ADDED!",
                status: "primary",
                pos: "top-right",
                timeout: 4000,
              });

              //reload locations
              retrieveLocations();
            },
            error: function (result, a, e) {
              $("#alertMessage").html("Error! Cannot insert a new Location!");
              UIkit.modal("#alertModal").show();
            },
          });
        } else {
          $("#alertMessage").html("This location already exist!");
          UIkit.modal("#alertModal").show();
        }
      },
      error: function (result, a, e) {
        $("#alertMessage").html("Error! Cannot insert a new Location!");
        UIkit.modal("#alertModal").show();
      },
    });
  };

  const editPersonDetails = (
    editfname,
    editlname,
    editemail,
    editjob,
    editDep,
    personID
  ) => {
    $.ajax({
      url: "libs/php/editPerson.php",
      type: "POST",
      data: {
        firstName: editfname,
        lastName: editlname,
        email: editemail,
        jobTitle: editjob,
        departmentID: editDep,
        personID: personID,
      },
      success: function (result) {
        // console.log(result["data"]);
        const temp = result["data"];

        const lName = temp["lastName"];
        const fName = temp["firstName"];
        const email = temp["email"];
        const jobTitle = temp["jobTitle"];
        const department = temp["department"];
        const location = temp["location"];

        //UPDATE INFO IN PERSON WINDOW
        if (
          location == "London" ||
          location == "New York" ||
          location == "Paris" ||
          location == "Munich" ||
          location === "Rome"
        ) {
          $("#cityImage").html(`<img
          src="img/${location}.jpg"
          alt="City Image"
          class="city-image "
        />`);
        } else {
          $("#cityImage").html(`<img
          src="img/skyline-silhouette.jpg"
          alt="City Image"
          class="city-image "
        />`);
        }
        $("#infoName").html(fName + " " + lName);
        $("#email").html(email);
        $("#jobTitle").html(jobTitle);
        $("#department").html(department);
        $("#location").html(location);

        //notification
        UIkit.notification({
          message: "EMPLOYEE DETAILS SUCCESSFULLY EDITED!",
          status: "primary",
          pos: "top-right",
          timeout: 4000,
        });

        //reload personnel
        retrievePersonnel();
      },
      error: function (result, a, e) {
        $("#alertMessage").html("Error! Cannot edit this person!");
        UIkit.modal("#alertModal").show();
      },
    });
  };

  const deletePerson = (personID) => {
    $.ajax({
      url: "libs/php/deletePerson.php",
      type: "POST",
      data: {
        id: personID,
      },
      success: function (result) {
        // console.log(result);

        UIkit.notification({
          message: "EMPLOYEE SUCCESSFULLY DELETED!",
          status: "primary",
          pos: "top-right",
          timeout: 4000,
        });

        $("#secPersoninfo").css("transform", "translateX(100%)");

        //reload personnel
        retrievePersonnel();
      },
      error: function (result, a, e) {
        $("#alertMessage").html("Error! Cannot delete this person!");
        UIkit.modal("#alertModal").show();
      },
    });
  };

  const deleteDepartment = (depID) => {
    $.ajax({
      url: "libs/php/deleteDepartment.php",
      type: "POST",
      data: {
        id: depID,
      },
      success: function (result) {
        // console.log(result);
        UIkit.notification({
          message: "DEPARTMENT SUCCESSFULLY DELETED!",
          status: "primary",
          pos: "top-right",
          timeout: 4000,
        });

        //reload personnel
        retrieveDepartments();

        UIkit.modal("#confirmDeleteDep").hide();
        UIkit.dropdown("#deleteDepWindow").hide(0);
      },
      error: function (result, a, e) {
        $("#alertMessage").html(
          "Error in retrieving employees inside department"
        );
        UIkit.modal("#alertModal").show();
      },
    });
  };

  const checkDepartment = (depID) => {
    //check if department have any dependencies
    $.ajax({
      url: "libs/php/checkDepartmentEmpty.php",
      type: "POST",
      data: {
        departmentID: depID,
      },

      success: function (result) {
        // if it's empty can be deleted
        if (result["data"]["COUNT"] == 0) {
          //Confirm alert
          Confirm.open({
            message: "Are you sure you want to delete this Department?",
            onok: () => {
              deleteDepartment(depID);
            },
          });
        } else {
          $("#alertMessage").html(
            "This department contains employees!! It cannot be deleted!"
          );
          UIkit.modal("#alertModal").show();
        }
      },
      error: function (result, a, e) {
        $("#alertMessage").html(
          "Error! Cannot delete the department from the database!"
        );
        UIkit.modal("#alertModal").show();
      },
    });
  };

  const deleteLocation = (locID) => {
    $.ajax({
      url: "libs/php/deleteLocation.php",
      type: "POST",
      data: {
        id: locID,
      },
      success: function (result) {
        console.log(locID);

        UIkit.notification({
          message: "LOCATION SUCCESSFULLY DELETED!",
          status: "primary",
          pos: "top-right",
          timeout: 4000,
        });

        //reload personnel
        retrieveLocations();

        UIkit.modal("#confirmDeleteLoc").hide();
        UIkit.dropdown("#deleteLocWindow").hide(0);
      },
      error: function (result, a, e) {
        $("#alertMessage").html(
          "Error in retrieving departments inside location"
        );
        UIkit.modal("#alertModal").show();
      },
    });
  };

  const checkLocation = (locID) => {
    //check if location have any dependencies
    $.ajax({
      url: "libs/php/checkLocationEmpty.php",
      type: "POST",
      data: {
        locationID: locID,
      },

      success: function (result) {
        // if it's empty can be deleted
        if (result["data"]["COUNT"] == 0) {
          //Confirm alert
          Confirm.open({
            message: "Are you sure you want to delete this location?",
            onok: () => {
              deleteLocation(locID);
            },
          });
        } else {
          $("#alertMessage").html(
            "This location contains departments and employees!! It cannot be deleted!"
          );
          UIkit.modal("#alertModal").show();
        }
      },
      error: function (result, a, e) {
        $("#alertMessage").html(
          "Error! Cannot delete the location from the database!"
        );
        UIkit.modal("#alertModal").show();
      },
    });
  };
  //////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////RETRIEVE DATA ON OPENING/////////////////////////////////
  retrievePersonnel();
  retrieveDepartments();
  retrieveLocations();

  //clear the search input
  $("#searchInput").val("");

  //clear edit employee
  $("#editfname").val("");
  $("#editlname").val("");
  $("#editemail").val("");
  $("#editjob").val("");
  $("#editDep").val("");

  //////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////LOAD agenda by SEARCH//////////////////////////////
  $("#searchInput").keyup(function () {
    retrievePersonnelBySearch($("#searchInput").val());
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////FORMS LOGIC/////////////////////////////////////////////////////////////

  // SUBMIT ADD EMPLOYEE FORM
  $("#formAddEmployee").submit(function (e) {
    e.preventDefault();

    insertNewPerson(
      $("#addfname").val(),
      $("#addlname").val(),
      $("#addemail").val(),
      $("#addjob").val(),
      $("#addDep").val()
    );

    // clearfields
    $("#addfname").val("");
    $("#addlname").val("");
    $("#addemail").val("");
    $("#addjob").val("");
    $("#addDep").val("");

    // close window
    UIkit.modal("#addEmployee").hide();
  });

  // SUBMIT ADD DEPARTMENT FORM
  $("#formAddDepartment").submit(function (e) {
    e.preventDefault();

    insertNewDepartment($("#addNewDep").val(), $("#addLoc").val());

    // close window
    UIkit.dropdown("#addDepWindow").hide(0);

    // clearfields
    $("#addNewDep").val("");
    $("#addLoc").val("");
  });

  // SUBMIT ADD LOCATION FORM
  $("#formAddLocation").submit(function (e) {
    e.preventDefault();

    insertNewLocation($("#addNewLoc").val());

    // close window
    UIkit.dropdown("#addLocWindow").hide(0);

    // clearfields
    $("#addNewLoc").val("");
  });

  // SUBMIT EDIT EMPLOYEE FORM
  $("#formEditEmployee").submit(function (e) {
    e.preventDefault();

    let editfname = "";
    let editlname = "";
    let editemail = "";
    let editjob = "";

    $("#editfname").val() == ""
      ? (editfname = $("#editfname").attr("placeholder"))
      : (editfname = $("#editfname").val());
    $("#editlname").val() == ""
      ? (editlname = $("#editlname").attr("placeholder"))
      : (editlname = $("#editlname").val());
    $("#editemail").val() == ""
      ? (editemail = $("#editemail").attr("placeholder"))
      : (editemail = $("#editemail").val());
    $("#editjob").val() == ""
      ? (editjob = $("#editjob").attr("placeholder"))
      : (editjob = $("#editjob").val());

    editPersonDetails(
      editfname,
      editlname,
      editemail,
      editjob,
      $("#editDep").val(),
      currentPersonID
    );

    // clear and update fields
    $("#editfname").val(""),
      $("#editlname").val(""),
      $("#editemail").val(""),
      $("#editjob").val(""),
      $("#editDep").val("");
    $("#editfname").attr("placeholder", editfname),
      $("#editlname").attr("placeholder", editlname),
      $("#editemail").attr("placeholder", editemail),
      $("#editjob").attr("placeholder", editjob),
      // $("#editDep").val("");

      // close window
      UIkit.modal("#editEmployee").hide();
  });

  $("#deleteButton").on("click", () => {
    Confirm.open({
      message: "Are you sure you want to delete this Employee?",
      onok: () => {
        deletePerson(currentPersonID);

        //clear fields
        $("#cityImage").html(`<img
        src="img/skyline-silhouette.jpg"
        alt="City Image"
        class="city-image "
      />`);
        $("#infoName").html("");
        $("#email").html("");
        $("#jobTitle").html("");
        $("#department").html("");
        $("#location").html("");
      },
    });
  });

  $("#deleteDepButton").on("click", () => {
    checkDepartment($("#deleteDep").val());
  });

  $("#deleteLocButton").on("click", () => {
    checkLocation($("#deleteLoc").val());
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////ACTIONS AND ANIMATIONS////////////////////////////////////////////////////////////////////////////

  //LABELS animations

  $("#btnPersonnel").on("click", () => {
    retrievePersonnel();
    $("#btnPersonnel").css("width", "55px");
    $("#depSection").css("transform", "translateX(-110%)");
    $("#locSection").css("transform", "translateX(-110%)");
    $("#btnDep").css("width", "45px");
    $("#btnLoc").css("width", "45px");
    locSlided = false;
    depSlided = false;

    //update selection bar
    $("#selectionResearch").html(`personnel: All`);
    $(".selection-par").css("backgroundColor", "var(--primary-color)");

    //clear the search input
    $("#searchInput").val("");
  });
  $("#btnDep").on("click", () => {
    if (!depSlided) {
      retrieveDepartments();

      $("#depSection").css("transform", "translateX(0)");
      $("#locSection").css("transform", "translateX(-110%)");
      $("#btnDep").css("width", "55px");
      $("#btnLoc").css("width", "45px");
      depSlided = true;
      locSlided = false;
    } else {
      $("#depSection").css("transform", "translateX(-110%)");
      $("#btnDep").css("width", "45px");
      depSlided = false;
    }
  });
  $("#btnLoc").on("click", () => {
    if (!locSlided) {
      retrieveLocations();

      $("#depSection").css("transform", "translateX(-110%)");
      $("#locSection").css("transform", "translateX(0)");
      $("#btnDep").css("width", "45px");
      $("#btnLoc").css("width", "55px");
      locSlided = true;
      depSlided = false;
    } else {
      $("#locSection").css("transform", "translateX(-110%)");
      $("#btnLoc").css("width", "45px");
      locSlided = false;
    }
  });

  //CLOSE BUTTONS
  $("#closePersonInfo").on("click", () => {
    $(".secPersonInfo").css("transform", "translate(100%)");
  });

  $("#closeAddDep").on("click", () => {
    UIkit.dropdown("#addDepWindow").hide(0);
  });
  $("#closeDelDep").on("click", () => {
    UIkit.dropdown("#deleteDepWindow").hide(0);
  });
  $("#closeAddLoc").on("click", () => {
    UIkit.dropdown("#addLocWindow").hide(0);
  });
  $("#closeDelLoc").on("click", () => {
    UIkit.dropdown("#deleteLocWindow").hide(0);
  });
});

//////////////////////////// CONFIRM LOGIC ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Confirm = {
  open(options) {
    options = Object.assign(
      {},
      {
        title: "",
        message: "",
        cancelText: "Cancel",
        okText: "OK",
        onok: function () {},
        oncancel: function () {},
      },
      options
    );

    const html = `
      <div class="confirm">
        <div class="confirm__window">
        <img
                src="vendors/icons/close-outline.svg"
                alt="Close X"
                class="uk-modal-close close-confirm"
                id="closeConfirm"
              />
          <div class="confirm__content">
            <img
              src="vendors/icons/warning.svg"
              alt="Warning Icon"
              class="warning-icon" />
            <p>${options.message}</p>
          </div>
          <div class="confirm__buttons">
            <button class="button confirm__button confirm__button--cancel">${options.cancelText}</button>
            <button class="button confirm__button confirm__button--ok confirm__button--fill">${options.okText}</button>
          </div>
        </div>
      </div>
    `;

    const template = document.createElement("template");
    template.innerHTML = html;

    // Elements
    const confirmEl = template.content.querySelector(".confirm");
    const btnOk = template.content.querySelector(".confirm__button--ok");
    const closeConfirm = template.content.querySelector("#closeConfirm");
    const btnCancel = template.content.querySelector(
      ".confirm__button--cancel"
    );

    confirmEl.addEventListener("click", (e) => {
      if (e.target === confirmEl) {
        options.oncancel();
        this._close(confirmEl);
      }
    });

    btnOk.addEventListener("click", () => {
      options.onok();
      this._close(confirmEl);
    });

    closeConfirm.addEventListener("click", () => {
      options.oncancel();
      this._close(confirmEl);
    });

    btnCancel.addEventListener("click", () => {
      options.oncancel();
      this._close(confirmEl);
    });

    document.body.appendChild(template.content);
  },

  _close(confirmEl) {
    confirmEl.classList.add("confirm--close");

    confirmEl.addEventListener("animationend", () => {
      document.body.removeChild(confirmEl);
    });
  },
};
