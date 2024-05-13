package com.example.webchatserver.webchatserver;

import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;

@ServerEndpoint("/roomWebSocket")
public class RoomWebSocket {

    @OnOpen
    public void onOpen(Session session) {
        try {
            String roomsString = String.join(",", ChatServlet.rooms);
            session.getBasicRemote().sendText(roomsString);
        } catch (IOException e) {
            System.err.println("Error sending rooms list to client: " + e.getMessage());
            e.printStackTrace();
        }
    }
}