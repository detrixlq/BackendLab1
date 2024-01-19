const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from 'mychat' directory
app.use('/static', express.static('mychat'));

// Respond with a plain text message "hi"
app.get('/', (req, res) => {
    res.send('hi');
});

// Respond with a JSON object
app.get('/json', (req, res) => {
    res.json({ text: 'hi', numbers: [1, 2, 3] });
});

// Echo back the input query parameter in various formats
app.get('/echo', (req, res) => {
    const input = req.query.input;
    if (!input) {
        return res.status(400).send('No input query parameter provided');
    }

    const response = {
        normal: input,
        shouty: input.toUpperCase(),
        characterCount: input.length,
        backwards: input.split('').reverse().join('')
    };

    res.json(response);
});

// Establish a Server-Sent Events (SSE) connection
app.get('/sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Function to send a message
    const sendSse = (id, data) => {
        res.write(`id: ${id}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const interval = setInterval(() => {
        sendSse(Date.now(), { message: "Real-time message from server" });
    }, 5000);

    req.on('close', () => {
        clearInterval(interval);
    });
});

// Real-time communication using Socket.io
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg) => {
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
