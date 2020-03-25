const cors = require('cors');
const express = require('express');
const scrap = require('./routes/scrap');
const mqConsumer = require('../src/services/MQConsumer');
const path = require('path');

const app = express();

// middlewares
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// settings
app.set('port', process.env.PORT || 3000);

// start sserver
const server = app.listen(app.get('port'), () => {
  console.log('Server on port ', app.get('port'));
});

// websockets
const io = require('socket.io').listen(server);

// listening for rebbitMQ consumer
mqConsumer.startConsumer(io);

/*
io.on('connection', () => {
  console.log('New conection');
});
*/
// static files

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

// routes
app.use('/api/v1', scrap);

app.use((req, res, next) => {
  if (!res.data) {
    return res.status(404).send({
      status: false,
      error: {
        reason: 'Invalid Endpoint',
        code: 404
      }
    });
  }
});