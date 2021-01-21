//utility functions:
//1.utility function to get DOM element from string

function getElementFromString(string) {
  let div = document.createElement("div");
  div.innerHTML = string;
  return div.firstElementChild;
}

//initialize no of parameters:
let addedParamCount = 0;

//hide the parameters box initially

let parametersBox = document.getElementById("parametersBox");
parametersBox.style.display = "none";

//if the user clicks on params box,hide the json box

let paramsRadio = document.getElementById("paramsRadio");
paramsRadio.addEventListener("click", function () {
  document.getElementById("requestJsonBox").style.display = "none";
  document.getElementById("parametersBox").style.display = "block";
});

//if the user clicks on json box, hide the params box

let jsonRadio = document.getElementById("jsonRadio");
jsonRadio.addEventListener("click", function () {
  document.getElementById("parametersBox").style.display = "none";
  document.getElementById("requestJsonBox").style.display = "block";
});

//if the user clicks on +button, add more parameters

let addParam = document.getElementById("addParam");
addParam.addEventListener("click", function () {
  let params = document.getElementById("params");
  let string = `<div class="row g-3 my-2">
    <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label">Parameter ${
      addedParamCount + 2
    }</label>
    <div class="col-sm-4">
        <input type="text" class="form-control" placeholder="Enter Parameter ${
          addedParamCount + 2
        } key" id="parameterKey${addedParamCount + 2}">
    </div>
    <div class="col-sm-4">
        <input type="text" class="form-control" placeholder="Enter Parameter ${
          addedParamCount + 2
        } value" id="parameterValue${addedParamCount + 2}">
    </div>
   
        <button  class=" col-auto btn btn-outline-primary deleteParam">-</button>

 </div>`;

  // convert the element string to DOM node
  let paramElement = getElementFromString(string);
  params.appendChild(paramElement);

  //add an event listener to remove the parameter on clicking - button

  let deleteParam = document.getElementsByClassName("deleteParam");
  for (item of deleteParam) {
    item.addEventListener("click", (e) => {
      if (confirm("Do you really want to delete the parameters?")) {
        e.target.parentNode.remove();
      }
    });
  }
  addedParamCount++;
});

//if user clicks on submit button

let submit = document.getElementById("submit");
submit.addEventListener("click", () => {
  //show please wait in the response box to request patience from the user

  // document.getElementById("responseJsonText").value = "Please wait..fetching response.. ";
  document.getElementById("responsePrism").innerHTML =
    "Please wait..fetching response.. ";

  //fetch all the values user has entered

  let url = document.getElementById("url").value;
  let requestType = document.querySelector("input[name='requestType']:checked")
    .value;
  let contentType = document.querySelector("input[name='contentType']:checked")
    .value;

  //if user has used params option instead of json , collect all the parameters in an object

  if (contentType == "params") {
    data = {};
    for (i = 0; i < addedParamCount + 1; i++) {
      if (document.getElementById("parameterKey" + (i + 1)) != undefined) {
        let key = document.getElementById("parameterKey" + (i + 1)).value;
        let value = document.getElementById("parameterValue" + (i + 1)).value;
        data[key] = value;
      }
    }
    data = JSON.stringify(data);
  } else {
    data = document.getElementById("requestJsonText").value;
  }
  //log all the values in the console for debugging

  console.log("URL is", url);
  console.log("requestType is", requestType);
  console.log("contentType is", contentType);
  console.log("data is", data);

  //if the request type is GET
  if (requestType == "GET") {
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.text())
      .then((text) => {
        document.getElementById("responsePrism").innerHTML = text;
        Prism.highlightAll();
      });
  } else {
    fetch(url, {
      method: "POST",
      body: data,
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.text())
      .then((text) => {
        document.getElementById("responsePrism").innerHTML = text;
        Prism.highlightAll();
      });
  }
});
