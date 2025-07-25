// socket.ts (Frontend)
import { io } from 'socket.io-client';

const socket = io('https://gigo-tracker.onrender.com', {
  transports: ['websocket'], // ✅ Important for Expo compatibility
});

export default socket;
