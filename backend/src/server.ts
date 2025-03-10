// The main purpose of this sever is to relay the SDPs along with ICE candidates between the two peers.
import { WebSocketServer, WebSocket} from "ws";

const wss = new WebSocketServer({
    port: 8000
})

wss.on("connection", (socket: WebSocket) => {
    console.log("New client connected!");


})