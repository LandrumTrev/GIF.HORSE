// GIF.HORSE
// API and AJAX single page app, powered by GIPHY
// © Richard Trevillian, 2018-09-13
// University of Richmond, Full Stack Web Development Bootcamp
// JavaScript and jQuery


// START jQUERY FUNCTION
// ----------------------------------------------------------------

$(document).ready(function () {

    // ----------------------------------------------------------------

    // Array to hold the display names (with spaces, U&lc) of each topic button
    let topicsArray = [
        "Drone",
        "Unicorn",
        "Platypus",
        "Echidna",
        "Pangolin",
        "Honey Badger",
        "Shiba Inu",
        "Penguin",
        "Octopus",
        "MST3K",
        "Moana",
        "Alf",
        "Ferret",
        "Dolphin",
        "Owl",
        "Cat",
        "Siberian Husky"
    ];

    // intialized globally, so various functions and variables can change it or access it
    let currentTopic = "";

    // set the number of images returned on a topic button push
    let numberOfImagesReturned = 3;

    // ----------------------------------------------------------------


    // CREATE TOPIC BUTTONS FOR ALL ELEMENTS IN topicsArray
    function makeButtons() {

        // clear out all existing buttons before repopulating the list
        $("#button_contain").html("");

        // used in FOR loop below to convert names in topicsArray to URL format for button IDs
        let topicFormatter = function (topicName) {

            // convert passed-in name to lower case
            let topicLowerCase = topicName.toLowerCase();

            // then take the lower-cased name and replace any spaces with +
            let topicPlussed = topicLowerCase.replace(" ", "+");

            // and return the lower-cased and plussed name as the value of topicFormatter()
            return topicPlussed;
        };

        // loop through all elements in topicsArray
        for (let i = 0; i < topicsArray.length; i++) {

            // variable stands for the current looped topic unformatted name (button innerText)
            const subjectName = topicsArray[i];

            // variable stands for the current looped topic formatted name (button ID)
            const subjectID = topicFormatter(subjectName);

            // create a button with loop item's innerText and ID
            let buttonTemplate = function () {

                // Template Literal to create a button and .prepend it to #button_contain <aside>
                $("#button_contain").prepend(`
                    <button type="button" id="${subjectID}" class="topic_button btn btn-secondary btn-sm">
                        <span class="button_type">${subjectName}</span>
                    </button>
                `);
            };

            // call buttonTemplate() on each loop to create a button for a topic name from topicsArray
            buttonTemplate();
        }
    };


    // WHEN PAGE LOADS OR RELOADS, BUILD A LIST OF THE DEFAULT TOPIC BUTTONS
    makeButtons();


    // ----------------------------------------------------------------


    // CALLBACK FOR THE AJAX PROMISE
    let makeCard = function (response) {

        // holds the entire object returned by the ajax call
        const imageObject = response.data;

        // creates a card for each gif returned by ajax call
        let cardTemplate = function () {
            // Template Literal to create a Boostrap card for each image and prepend it to #card_contain DIV
            $("#card_contain").prepend(`
                    <div class="card">
                        <img class="card-img-top gif" 
                            src="${imageObject.images.original_still.url}" 
                            data-still="${imageObject.images.original_still.url}" 
                            data-animate="${imageObject.images.downsized.url}" 
                            data-state="still">
                        <ul class="list-group list-group-flush">
                            <li class="gif_title list-group-item">
                                <span class="title">${imageObject.title}</span>
                            </li>
                        </ul>
                    </div>
                `);

            // !!?? WEIRDNESS: THIS BLOCK ONLY PUTS THE TOGGLE HANDLER ON ODD-NUMBERED CARDS!!??
            $(".card-img-top").on("click", function () {

                // variable to stand for the data-state attribute of the image clicked on
                var state = $(this).attr("data-state");

                // if data-state is ANIMATE, then...
                if (state === "animate") {
                    // change the img's data-state="" to "still"
                    $(this).attr("data-state", "still");
                    // change the img's src="" to the value of the data-still="" attribute
                    $(this).attr("src", $(this).attr("data-still"));

                } else if (state === "still") {
                    // change the img's data-state="" value to "animate"
                    $(this).attr("data-state", "animate");
                    // change the src="" to the value of the img's data-animate="" attribute
                    $(this).attr("src", $(this).attr("data-animate"));
                }
            });

        };

        // !!?? WEIRDNESS: THIS BLOCK ONLY PUTS THE TOGGLE HANDLER ON EVEN-NUMBERED CARDS!!??
        $(".card-img-top").on("click", function () {

            // variable to stand for the data-state attribute of the image clicked on
            var state = $(this).attr("data-state");

            // if data-state is ANIMATE, then...
            if (state === "animate") {
                // change the img's data-state="" to "still"
                $(this).attr("data-state", "still");
                // change the img's src="" to the value of the data-still="" attribute
                $(this).attr("src", $(this).attr("data-still"));

            } else if (state === "still") {
                // change the img's data-state="" value to "animate"
                $(this).attr("data-state", "animate");
                // change the src="" to the value of the img's data-animate="" attribute
                $(this).attr("src", $(this).attr("data-animate"));
            }
        });

        // calls cardTemplate once each loop to create a button for that looped topic
        cardTemplate();

    };

    // ----------------------------------------------------------------


    // DEFINE MAKE NEW BUTTON FUNCTION, USED BY "ADD IT!" BUTTON and RETURN BUTTON EVENT HANDLERS
    let makeNewButton = function () {

        // variable to hold text entered in the "make new category" input field
        let newButtonName = $("#addit_data").val();

        // .push the new button name to the end of the topicsArray
        topicsArray.push(newButtonName);

        // refresh list of all buttons on page by calling makeButtons()
        makeButtons();

        // clear the just submitted value out of the field and reset
        $("#addit_data").val("");

        // DUPLICATE CODE: ADD EVENT HANDLER TO THE NEWLY CREATED BUTTON
        // when a topic button is pressed, load initial batch of images matching the button's ID
        $(".topic_button").on("click", function () {

            // clear out all current gifs before getting a new batch
            $("#card_contain").html("");

            // variable to hold the ID of any .topic_button clicked on
            let buttonTopic = $(this).attr("id");

            // set the currentTopic var's value as value of buttonTopic
            // so the PLUS button below knows what topic to grab more images for
            currentTopic = buttonTopic;

            // using Trilogy's production key; personal beta key was constantly being restricted
            let queryURL = "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&rating=G&tag=" + currentTopic + "";

            // run as many loops as the value of variable numberOfImagesReturned
            for (let k = 0; k < numberOfImagesReturned; k++) {

                // make a call for an image
                $.ajax({
                        url: queryURL,
                        method: "GET"
                    })
                    .then(function (response) {
                        // build a Bootstrap card with a Template Literal and attach a click Event Handler
                        makeCard(response);
                    });
            };
        });
    };


    // MAKE A NEW CATEGORY BUTTON FUNCTION WITH INPUT'S ADD IT BUTTON
    $("#addit_btn").on("click", function () {
        // making sure that there is data in the field so no blank buttons are created
        if ($("#addit_data").val() !== "") {
            // call makeNewButton to make a new button when return is pressed
            makeNewButton();
        }
    });


    // MAKE A NEW CATEGORY BUTTON FUNCTION ENTER/RETURN KEY PRESS
    $(document).keypress(function (e) {
        // listening for the Enter/Return keypress (key 13)
        // and also making sure that there is data in the field so no blank buttons are created
        if (e.which === 13 && $("#addit_data").val() !== "") {
            // call makeNewButton to make a new button when return is pressed
            makeNewButton();
        }
    });

    // ----------------------------------------------------------------


    // LOAD A FRESH BATCH OF RANDOM GIFS WHEN A TOPIC BUTTON IS PRESSED
    $(".topic_button").on("click", function () {

        // clear out all current gifs before getting a new batch
        $("#card_contain").html("");

        // variable to hold the ID of any .topic_button clicked on
        let buttonTopic = $(this).attr("id");

        // set the currentTopic var's value as value of buttonTopic
        // so the PLUS button below knows what topic to grab more images for
        currentTopic = buttonTopic;

        // using Trilogy's production key; personal beta key was constantly being restricted
        let queryURL = "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&rating=G&tag=" + currentTopic + "";

        // run as many loops as the value of variable numberOfImagesReturned
        for (let k = 0; k < numberOfImagesReturned; k++) {

            // make a call for an image
            $.ajax({
                    url: queryURL,
                    method: "GET"
                })
                .then(function (response) {
                    // build a Bootstrap card with a Template Literal and attach a click Event Handler
                    makeCard(response);
                });
        };
    });

    // ----------------------------------------------------------------


    // PLUS BUTTON ADDS ONE MORE IMAGE OF CURRENT SUBJECT
    $("#plus").on("click", function () {

        // using Trilogy's production key; personal beta key was constantly being restricted
        let queryURL = "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&rating=G&tag=" + currentTopic + "";

        // make a call for an image
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function (response) {
                // build a Bootstrap card with a Template Literal and attach a click Event Handler
                makeCard(response);
            });
    });

    // ----------------------------------------------------------------


    // CLICKING ON PAGE HEADER LOGO RELOADS PAGE TO BLANK
    $("#minus").on("click", function () {

        window.location.reload(true);
    });

    // END jQUERY FUNCTION
});
// ----------------------------------------------------------------
