const io = require('socket.io-client');

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  query: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJpam92YXJnaGVzZ2U0NTBAZ21haWwuY29tIiwic3ViIjo0LCJpYXQiOjE3MjE2MzYyMDAsImV4cCI6MTcyMTYzOTgwMH0.--OHSZhpa3qYVwNCyEehyG0nKjQqOJt57zx3ikJzEU4', // Replace with a valid JWT token
  }
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');

  // Send a test message to the server
  socket.send('Hello from test client');
});

socket.on('message', (data) => {
  console.log('Received:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});
