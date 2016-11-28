var UserController = require('./UserController');

module.exports = app => {
  app.get('/api/user', UserController.read);
  app.put('/api/user/:id', UserController.update);
  app.delete('/api/user/:id', UserController.delete);
  app.get('/api/user/:id', UserController.currentUser);
};

