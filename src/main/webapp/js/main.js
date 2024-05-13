let ws;

function createNewRoom() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log("You are already in a room. Cannot create a new room.");
        return;
    }

    fetch("http://localhost:8080/WSChatServer-1.0-SNAPSHOT/chat-servlet", {
        method: 'GET',
        headers: { 'Accept' : 'text/plain', },
        mode: 'cors' // Add this line to enable CORS mode
    })
        .then(response => response.text())
        .then(response => {
            document.getElementById("chat-container").value = "";
            enterRoom(response);
            addRoomButton(response);
        })
        .catch(error => {
            console.error("Error when creating new room: ", error);
        })
}

function newRoom(){
    // calling the ChatServlet to retrieve a new room ID
    let callURL= "http://localhost:8080/WSChatServer-1.0-SNAPSHOT/chat-servlet";
    fetch(callURL, {
        method: 'GET',
        headers: {
            'Accept': 'text/plain',
        },
    })
        .then(response => response.text())
        .then(response => enterRoom(response)); // enter the room with the code
}
function enterRoom(code){

    console.log("ENTERING: " + code);
    // refresh the list of rooms

    // create the web socket
    ws = new WebSocket("ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/ws/" + code);

    // Check if the room code already exists in the list
    /*if (!isRoomCodeInList(code)) {
        // Add the room code to the list only if it's not already present
        const table = document.getElementById("room-code");
        const newRow = table.insertRow();
        const cell1 = newRow.insertCell();
        cell1.textContent = code;
    }*/

    setRoomText(code);

    ws.onopen = function () {
        // Displays a message
        let welcome = "[" + timestamp() + "] (Server " + code.trim() + "): You are in the room: " + code.trim() + "\n";
        document.getElementById("textarea").value += "\n" + welcome;
    }

    ws.onerror = function(error) {
        console.error("WebSocket error: ", error);
    };
    // parse messages received from the server and update the UI accordingly
    ws.onmessage = function (event) {
        console.log(event.data);
        // parsing the server's message as json
        let message = JSON.parse(event.data);
        // handle message
        document.getElementById("textarea").value += "[" +  timestamp() + "] " + message.message + "\n";
        //createMessage(message.type, true, message.message, message.username)
    }

    function sendMessage() {
        let inputElement = document.getElementById("input");
        let message = inputElement.value.trim();
        if (message !== "") {
            let request = {"type": "chat", "msg": message};
            ws.send(JSON.stringify(request));
            inputElement.value = "";
        }
    }

    document.getElementById("input").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    document.getElementById("sendButton").addEventListener("click", function() {
        sendMessage();
    });

    // connect game room
    connectGame(code);
}

function leave() {
    console.log("Leaving room: " + roomText);
    if (ws && ws.readyState === WebSocket.OPEN) {
        let request = {"type": "leave", "userID": ws.userID};
        ws.send(JSON.stringify(request));
        document.getElementById("textarea").value = "";
        setRoomText("");
        ws.close();
    }
}

function addRoomButton(code) {
    if (code === null || code === undefined || code === "") {
        return;
    }
    const roomListContainer = document.getElementById("chat-room-list");
    const roomElement = document.createElement("div");
    console.log(code);

    // Create and append the span element containing the room code
    const codeSpan = document.createElement("span");
    codeSpan.textContent = code;
    roomElement.appendChild(codeSpan);

    // Create and append the join button with an event listener
    const joinButton = document.createElement("button");
    joinButton.textContent = "Join";
    joinButton.setAttribute('title', 'Exit current room to join another');
    joinButton.addEventListener("click", function() {
        joinPreExistingRoom(code);
    });
    roomElement.appendChild(joinButton);

    // Append the room element to the room list container
    roomListContainer.appendChild(roomElement);
}

function joinPreExistingRoom(code) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        enterRoom(code);
    } else {
        console.log("You are already in a room.");
    }
}

function onRefreshButtons() {
    const ws = new WebSocket('ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/roomWebSocket');

    ws.onmessage = function(event) {
        //server sends the rooms as a comma-separated string
        const rooms = event.data.split(',');
        const roomListContainer = document.getElementById("chat-room-list");
        roomListContainer.innerHTML = "";
        rooms.forEach(roomId => {
            addRoomButton(roomId.trim());
        });
    };

    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
}

// Client Website Components and Functions
const chatContainer = document.querySelector("#chat-container");
const roomText = document.querySelector("#room-text")

function setRoomText(roomCode) {
    if (roomCode === null || roomCode === undefined || roomCode === "") {
        roomText.innerHTML = "You are not in a Room";
        return;
    }
    roomText.innerHTML = "You are in Room: " + roomCode;
}

function  clearMessages() {
    chatContainer.innerHTML = ``;
}

function createMessage(messageType, withTime, messageContent, username) {
    if (messageContent === null) { return; }
    const newMessage = document.createElement("div");

    if (messageType === "sender") {
        newMessage.setAttribute("class","sender chat-bubble")
    } else if (messageType === "system-notification") {
        newMessage.setAttribute("class", "system-notification chat-bubble")
    } else {
        newMessage.setAttribute("class", "receiver chat-bubble")
    }
    if (withTime === true) {
        newMessage.innerHTML = `<span class="timestamp">${timestamp() + " [" + username + "]"}</span>`
    }

    newMessage.innerHTML = `${newMessage.innerHTML}${messageContent}`;
    chatContainer.appendChild(newMessage);
}

function timestamp() {
    let d = new Date(), minutes = d.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return d.getHours() + ':' + minutes;
}

(function() {
    setRoomText();
    onRefreshButtons();
})();

// Testing Functionality
/*
(function () {
    clearMessages();
    createMessage("sender", true, "Hello World!", "Test Name")
    createMessage("receiver", true, "Hello World!", "Test Name")
    createMessage("system-notification", true, "Hello World!", "Test Name")
    setRoomText("AAAAA")
})();*/

