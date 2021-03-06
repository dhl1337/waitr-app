const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config/config');

const port = process.env.PORT || 3000;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/../www'));

mongoose.connect(process.env.MONGODB_URI || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || config.db);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('Mongo connected at ' + config.db));

io.on('connection', socket => {
  socket.on('newPerson', data => io.emit('newPersonAdded', data));
  socket.on('deletePerson', data => io.emit('deletedPerson', data));
});

const authorize = roles => {
  return (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (authHeader) {
      let token = authHeader.split(' ').pop();
      jwt.verify(token, config.secretKey, (err, payload) => {
        if (err)
          res.status(401).send('Authorization Issue');
        else {
          if (roles.indexOf(payload.role) === -1) res.status(401).send('Unauthorized');
          else next();
        }
      });
    }
    else res.status(401).send('Unauthenticated');
  };
};

// PROTECTED TEST ROUTE
app.get('/protected', authorize(['restaurant']), (req, res) => {
  res.status(200).json('Auth worked!');
});

// authentication route
require('./authentication/AuthenticationRoute')(app);

// restaurant route
require('./restaurant/RestaurantRoute')(app);

// user route
require('./user/UserRoute')(app);

// waitlist route
require('./waitlist/WaitlistRoute')(app);

http.listen(port, () => console.log("listening on port ", port));
