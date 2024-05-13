package com.example.webchatserver.webchatserver;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@ServerEndpoint("/rps/{roomID}")
public class RpsGameServer {
    private static final Map<String, Session[]> roomSessions = new HashMap<>();
    private static final Map<String, String[]> roomChoices = new HashMap<>();

    @OnOpen
    public void onOpen(@PathParam("roomID") String roomID, Session session) throws IOException {
        session.getBasicRemote().sendText("0,Welcome to the Rock-Paper-Scissors game room. Please wait for another player to join.");
        roomSessions.computeIfAbsent(roomID, k -> new Session[2]);
        Session[] sessions = roomSessions.get(roomID);

        synchronized (sessions) {
            if (sessions[0] == null) {
                sessions[0] = session;
            } else if (sessions[1] == null) {
                sessions[1] = session;
                sessions[0].getBasicRemote().sendText("1,Another player has joined. You can now make your move.");
                session.getBasicRemote().sendText("1,Another player has joined. You can now make your move.");
            } else {
                session.getBasicRemote().sendText("0,Room is full.");
//                session.close(new CloseReason(CloseReason.CloseCodes.UNEXPECTED_CONDITION, "Room is full"));
                return;
            }
        }

        roomChoices.putIfAbsent(roomID, new String[2]);
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        JSONObject jsonMsg = new JSONObject(message);
        String roomID = jsonMsg.getString("roomID").trim();
        String choice = jsonMsg.getString("choice").trim();

        Session[] sessions = roomSessions.get(roomID);
        String[] choices = roomChoices.get(roomID);

        int playerIndex = session.equals(sessions[0]) ? 0 : 1;
        choices[playerIndex] = choice;

        broadcastToRoom(roomID, "Player " + (playerIndex + 1) + " has made their choice.", 1);

        if (choices[0] != null && choices[1] != null) {
            String result = determineWinner(choices);
            broadcastToRoom(roomID, result, 2);
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            choices[0] = null; // Reset choices after each round
            choices[1] = null;
            broadcastToRoom(roomID, "You can now make your move.", 1);
        }
    }

    @OnClose
    public void onClose(Session session, @PathParam("roomID") String roomID) throws IOException {
        Session[] sessions = roomSessions.get(roomID);
        if (session != sessions[0] && session != sessions[1]) {
            return;
        }
        if (sessions != null) {
            if (sessions[0] == session) sessions[0] = null;
            else if (sessions[1] == session) sessions[1] = null;
            broadcastToRoom(roomID, "A player has left the game.", 0);
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("WebSocket Error: " + throwable.getMessage());
    }

    private void broadcastToRoom(String roomID, String message, int page) throws IOException {
        Session[] sessions = roomSessions.get(roomID);
        if (sessions != null) {
            for (Session s : sessions) {
                if (s != null && s.isOpen()) {
                    s.getBasicRemote().sendText(page + "," + message);
                }
            }
        }
    }

    private String determineWinner(String[] choices) {
        Map<String, String> rules = new HashMap<>();
        rules.put("ROCK", "SCISSORS");
        rules.put("PAPER", "ROCK");
        rules.put("SCISSORS", "PAPER");

        if (choices[0].equals(choices[1])) {
            return "It's a tie!," + choices[0] + "," + choices[1];
        } else if (rules.get(choices[0]).equals(choices[1])) {
            return "Player 1 wins!," + choices[0] + "," + choices[1];
        } else {
            return "Player 2 wins!," + choices[0] + "," + choices[1];
        }
    }
}