import { io } from 'socket.io-client';
const socket = io(__SERVER_URL__)
export default socket;