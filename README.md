# This is a copy of the original Final Project I was apart of, github repo importing isn't working so this is just my work around.

# Final - Rock Paper Scissors with Web Chat Server Addition

## Project Information
Group Members: Justin Lau, Jonathan Mathew, Ethan Janovitz, Rithika Rushendra


This software project allows multiple users to create and/or join chatrooms where they will be able to send messages to each other. Each message will have the username of the sender and the timestamp of the message. The html page also features a list of the open chatrooms along with an "about" page which showcases the contributers to this project.

For the final we added onto the chat server assignment, we added a Rock Paper Scissors element to it, 2 clients MUST be in the same room inorder to play against each other

https://github.com/OntarioTech-CS-program/w24-csci2020u-final-project-rushendra-janovitz-lau-mathew/assets/114007476/ac8dce68-09ca-4946-9e86-c6cf0a63b8f5

## Improvements

**HTML UI**

Improvements made to the UI include making the colour scheme to match that of Ontario Tech University and adding buttons to switch between the about page and the chatrooms with different visual states. These visual states include when a button is pressed or unpressed as well as when a button is being hovered over.

Additional Improvements are visual, players can select pictures for what they want to use instead of a button that just says for example "rock", this make the website more appealing and is just a quality of life improvement.

**Functionality Improvements**

- A separate input text box was added along with a "send" button underneath the text chat box. 
- In the chatrooms, the history of the chat is saved when all the users leave room. When the chat is reopened the history of that chat is then loaded. 
- A button was added to refresh the available chatrooms in the left panel
- Can play multiple rounds of Rock Paper Scissors
- If a 3rd person tries to join a chat room, it tell's them it's full (Max 2 players)

## How To Run

Prerequisite Software:
1. Intellij Idea IDE
2. Glassfish version 7.x
3. Java JDK version 18.x or higher


To run this application, run the command `git clone https://github.com/OntarioTech-CS-program/w24-csci2020u-final-project-rushendra-janovitz-lau-mathew.git`. You could also create a new project from version control in Intellij IDEA using the same link.

Next, open the project directory as a project in Intellij Idea and set a Glassfish server configuration for it. After, use Maven to load the pom.xml file in order to get any dependencies necessary.

Then you will need to configure Glassfish for this project. You can do this by setting the domain to `domain1`, and add the program's `war exploded` artifact in the deployment section of Glassfish's configuration settings.

After, you need to run the project, wait for it to successfully deploy then visit the index.html page in your browser.

To verse another you both need to join the same room, make sure you press 'ctrl +` to zoom out in order to see the full page and play the game correctly, this is something we can improve on in a later date.
## Contribution Report

- https://github.com/OntarioTech-CS-program/w24-csci2020u-final-project-rushendra-janovitz-lau-mathew/graphs/contributors


- Rithika, Ethan - Frontend and Backend (Both worked from Ethan's laptop so all commits are in Ethan's name), Game Logic


- Justin - Backend code


- Jonathan - Frontend and Backend, Game Logic

## Other Resources

[1] Week 12 - WebSockets in Java (extended) https://github.com/OntarioTech-CS-program/WebSocketsChatServer

[2] Week 12 - WebSockets in Java (extended) https://github.com/OntarioTech-CS-program/ChatAPI

[3] Twemoji Emoji Icon Images - https://github.com/twitter/twemoji
