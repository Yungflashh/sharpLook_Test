// utils/socket.ts
import { io } from "socket.io-client"

const socket = io("http://localhost:4001") // or your server URL

export default socket