let roomID_game = "default";
let ws_game;
let userChoice = '';




function changeContainer(code) {
    const content1 = document.getElementById("content1");
    const content2 = document.getElementById("content2");
    const content3 = document.getElementById("content3");

    if (code === null || code === undefined || code === "") {
        return;
    }
    content1.style.display = "none";
    content2.style.display = "none";
    content3.style.display = "none";
    if (code === 1) {
        content1.style.display = "flex";
    } else if (code === 2) {
        content2.style.display = "flex";
    } else if (code === 3) {
        content3.style.display = "flex";
    }
}

function updateSelectedChoice(choice) {
    document.getElementById('selectedMoveHeader').innerText = 'Selected: ' + choice.charAt(0).toUpperCase() + choice.slice(1);
}

function setImage(player, imageType) {
    let image;
    let text;
    if (player === 1) {
        image = document.getElementById("plr1img");
        text = document.getElementById("plr1txt");
    } else {
        image = document.getElementById("plr2img");
        text = document.getElementById("plr2txt");
    }
    if (imageType === "ROCK") {
        image.src = 'images/rock.png';
        text.innerHTML = imageType;
    } else if (imageType === "PAPER") {
        image.src = 'images/paper.png';
        text.innerHTML = imageType;
    } else if (imageType === "SCISSORS") {
        image.src = 'images/scissors.png';
        text.innerHTML = imageType;
    }
}

function parseEvent(event) {
    const data = event.split(',');
    const page = data[0];
    const message = data[1];
    changeContainer(parseInt(page, 10));
    document.getElementById('gameStatus').innerText = message;
    if (parseInt(page, 10) === 2) {
        const plr1 = data[2];
        const plr2 = data[3];
        setImage(1, plr1);
        setImage(2, plr2);
    }
}


function connectGame(code) {
    console.log("ENTERING: " + code);
    roomID_game = code;


    ws_game = new WebSocket("ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/rps/" + code);

    ws_game.onopen = function() {
        console.log("Connected to the WebSocket server");
    };

    ws_game.onmessage = function(event) {
        parseEvent(event.data);
    };

    ws_game.onerror = function(error) {
        console.log('WebSocket Error: ' + error);
    };

    ws_game.onclose = function() {
        console.log('WebSocket connection closed');
    };

    const options = document.querySelectorAll('.rps-option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            userChoice = this.getAttribute('id');
            updateSelectedChoice(userChoice);
        });
    });

    const confirmButton = document.getElementById("rps-confirm");
    confirmButton.addEventListener('click', () => {
        if (userChoice) {
            sendChoice(userChoice);
        } else {
            document.getElementById('selectedMoveHeader').innerText = 'Please select a move before confirming!'
            alert('Please select a move before confirming!');
        }
    });

}

function leaveGame() {
    console.log("Leaving room: " + roomID_game);
    if (ws_game && ws_game.readyState === WebSocket.OPEN) {
        document.getElementById('gameStatus').innerText = "Please join a room...";
        changeContainer(0);
        ws_game.close();
    }
}

function sendChoice(choice) {
    let user_choice = choice.toUpperCase();
    const message = JSON.stringify({
        roomID: roomID_game,
        choice: user_choice
    });
    ws_game.send(message);
}