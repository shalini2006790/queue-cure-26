const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve React build
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let state = {
  queue: [],
  currentToken: null,
  currentName: null,
  tokenCounter: 1,
  avgTime: 5,
  history: [],
  totalSeen: 0,
  lastCalledAt: null
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('state_update', state);

  socket.on('add_patient', (name) => {
    const patient = {
      token: state.tokenCounter++,
      name: name,
      addedAt: Date.now()
    };
    state.queue.push(patient);
    io.emit('state_update', state);
  });

  socket.on('call_next', (avgTime) => {
    if (state.queue.length === 0) return;
    if (state.currentToken !== null && state.lastCalledAt) {
      const duration = (Date.now() - state.lastCalledAt) / 60000;
      state.history.push(Math.round(duration * 10) / 10);
      if (state.history.length > 10) state.history.shift();
    }
    const next = state.queue.shift();
    state.currentToken = next.token;
    state.currentName = next.name;
    state.avgTime = avgTime || 5;
    state.lastCalledAt = Date.now();
    state.totalSeen++;
    io.emit('state_update', state);
  });

  socket.on('remove_patient', (index) => {
    state.queue.splice(index, 1);
    io.emit('state_update', state);
  });

  socket.on('update_avg_time', (avgTime) => {
    state.avgTime = avgTime;
    io.emit('state_update', state);
  });

  socket.on('reset_queue', () => {
    state = {
      queue: [],
      currentToken: null,
      currentName: null,
      tokenCounter: 1,
      avgTime: 5,
      history: [],
      totalSeen: 0,
      lastCalledAt: null
    };
    io.emit('state_update', state);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});