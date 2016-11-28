import WaitlistController from './WaitlistController';

module.exports = app => {
  app.get('/api/waitlist', WaitlistController.read);
  app.get('/api/waitlist/:id/list/:listId', WaitlistController.getFromList);

  app.post('/api/waitlist', WaitlistController.create);

  app.put('/api/waitlist/:id', WaitlistController.update);
  app.put('/api/waitlist/:id/list', WaitlistController.addToList);
  app.put('/api/waitlist/:id/list/:listId', WaitlistController.updateListEntry);

  app.delete('/api/waitlist/:id', WaitlistController.delete);
  app.delete('/api/waitlist/:id/list/:listId', WaitlistController.removeFromList);
};
