var botui = new BotUI('api-bot');



/* Fingers crossed this works or else this night is fucked */
function getDFresponse(res) {
    // Create a request variable and assign a new XMLHttpRequest object to it.

    var request = new XMLHttpRequest();

    var session = 12345

    console.log("res is " + res.value)

    //var res = "Hello"

    request.onload = function (res) {
        // Process our return data
        if (request.status >= 200 && request.status < 300) {
            // This will run when the request is successful
            console.log('success!', request);
        } else {
            // This will run when it's not
            console.log('The request failed!');
        }

        // This will run either way
        // All three of these are optional, depending on what you're trying to do
        console.log('This always runs...');


        // Begin accessing JSON data here
        var data = (this.response);

        // console.log("this is a response" + this.response);
        // console.log("this is the data" + data);


        socketResponse(data);
        //const app = document.getElementById('msgResp');
        //const root = document.getElementById('root');
        /*
        root.onload = function () {
            app.textContent = data;
        */
    }


    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'https://api.dialogflow.com/v1/query?v=20150910&lang=en&query=' + res.value + "&sessionId=" + session, true);

    request.setRequestHeader("Authorization", "Bearer 6e9a8c31260d49b48fe5287a8c807655");

    // Send request
    data = request.send();

}


/* End Dialogflow fuckery */



botui.message.add({
    content: "Hi! I'm Rheobot!",
    delay: 1500,
}).then(function () {
    botui.action.button({
        action: [{ // show only one button
                text: 'What can you do?',
                value: 'What can you do?'
            },
        ]
    }).then(function (res) {
        getDFresponse(res)
    })
});

/* This is where the fun begins */

function socketResponse(res) {

    var resp = JSON.parse(res);

    console.log(resp.result); // will print whatever was typed in the field.

    console.log("Response is " + ((resp)));
    var msgResp = resp.result.fulfillment.messages;
    resultList = []

    msgResp.forEach(function myFunction(item, index) {
        console.log(msgResp[index].speech);
        resultList.push(msgResp[index].speech);
    });

    resultList.forEach(function (item, index, array) {
        console.log(item, index);
        botui.message.add({
            content: item,
            delay: 500,
        }).then(userIn());
    })
};

function userIn() {
    botui.action.text({
        action: {
            placeholder: 'Say something',
        }
    }).then(function (res) {
        getDFresponse(res)
    })
}

// botui.message.add({
//   content: '',
//   delay: 1500,
// }).then(userIn());


/* This is where the fun ends */

function goDark() {
    var bodyElement = document.body;
    bodyElement.classList.toggle("dark-mode");

    var footerElement = document.getElementById("mainBody");
    footerElement.classList.toggle("dark-mode");

    var footerElement = document.getElementById("footerSocialBox");
    footerElement.classList.toggle("dark-mode");
}

function checkTime() {
    var now = new Date();
    hours = now.getHours();
    console.log(hours);
    console.log(typeof(hours))
    if (hours<7 || hours>19){
        goDark();
        toggleButton = document.getElementById("goDarkToggle");
        toggleButton.checked = true;
    }
}
