// socket.ts
import { io } from 'socket.io-client';

const socket = io('http://10.0.2.2:8000'); // replace with real IP if testing on mobile

export default socket;
