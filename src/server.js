const http = require('http');
const { Server } = require('socket.io');

// Create an HTTP server
const server = http.createServer();

// Create a Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for CORS
    methods: ['GET', 'POST'],
  },
});

// Handle client connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle incoming messages from the client
  socket.on('message', (data) => {
    console.log('Received message from client:', data);
    // Send a response back to the client
    socket.emit('message', 'Hello from server');
  });

  // Handle client disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server on a specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
