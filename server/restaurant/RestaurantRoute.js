var RestaurantController = require('./RestaurantController');

module.exports = app => {
    app.get('/api/restaurant', RestaurantController.read);
    app.get('/api/restaurant/:id', RestaurantController.currentRestId);

    app.post('/api/restaurant', RestaurantController.create);
    app.post('/api/restaurant/:id/menu', RestaurantController.getMenuItem);
    app.post('/api/restaurant/:id/menu/update', RestaurantController.updateItemMenu);

    app.put('/api/restaurant/:id', RestaurantController.update);
    app.put('/api/restaurant/menu/add/:id', RestaurantController.addItemToMenu);
    app.put('/api/restaurant/menu/remove/:id', RestaurantController.deleteItemToMenu);

    app.delete('/api/restaurant/:id', RestaurantController.delete);
};
