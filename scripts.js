var isDay = false;
var darkMode = false;


function goDark(setInMemory=false) {
    var bodyElement = document.body;
    bodyElement.classList.toggle("dark-mode");

    var mainBodyElement = document.getElementById("mainBodyDiv");
    mainBodyElement.classList.toggle("dark-mode");

    var footerElement = document.getElementById("footerSocialBox");
    footerElement.classList.toggle("dark-mode");

    var affirmationElement = document.getElementById("affirmationBox");
    affirmationElement.classList.toggle("dark-mode");
    
    if (setInMemory){
        if (affirmationElement.classList.contains("dark-mode")){
            darkMode = true;
            document.getElementById("toggleButtonLabel").innerHTML = '🌙&nbsp';
        } else {
            darkMode = false;
            document.getElementById("toggleButtonLabel").innerHTML = '🌞&nbsp';
        }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("manualSetting", JSON.stringify(true));   
    }
}

// alright so I've forgotten a major amount of the work I did here
// so, I might try to document it once I go through all the code
// (and get it working too, obvsly)

function checkStorageForConfig() {
    if (typeof(Storage) !== "undefined") {
        // Code for checking localStorage/sessionStorage availability.
        var configDarkMode = JSON.parse(localStorage.getItem("darkMode"));
        var configManualSetting = JSON.parse(localStorage.getItem("manualSetting"));

        // logging it here
        console.table(
            {
                'configDarkMode': configDarkMode,
                'configManualSetting': configManualSetting,
                'darkMode': darkMode
            }
        )

        if (configManualSetting) {
            if (configDarkMode != darkMode) {
                goDark();
                document.getElementById("goDarkToggle").checked = true;
                localStorage.setItem("darkMode", true);
                localStorage.setItem("lastCheckAtDay", true);
                localStorage.setItem("manualSetting", true);
            }
        } else {
            // Sorry! No Web Storage support.
            darkModeCheck();
        }

      } else {
        // Sorry! No Web Storage support.
        darkModeCheck();
      }
}

function darkModeCheck() {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 7 || hours > 19) {
        goDark();
        isDay = false
        document.getElementById("goDarkToggle").checked = true;
        document.getElementById("toggleButtonLabel").innerHTML = '🌙&nbsp';
        localStorage.setItem("darkMode", true);
        localStorage.setItem("lastCheckAtDay", false);
        localStorage.setItem("manualSetting", false);
    } else {
        document.getElementById("toggleButtonLabel").innerHTML = '🌞&nbsp';
        localStorage.setItem("darkMode", false);
        localStorage.setItem("lastCheckAtDay", true);
        localStorage.setItem("manualSetting", false);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function setAffirmation() {
    loadJSON(function(response){
        var affirmationData = JSON.parse(response);
        var affirmationList = affirmationData.affirmations;
        let affirmationIndex = affirmationList.length;
        let affirmationText = affirmationList[getRandomInt(affirmationIndex)];
        document.getElementById("affirmationBox").innerText = affirmationText
    })
}

function initPage() {
    setAffirmation();
    checkStorageForConfig();
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'affirmations.json', true); // Replace 'appDataServices' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }
