const Restaurant = require('./RestaurantModel');

module.exports = {
    create(req, res) {
        Restaurant
            .create(req.body, (err, result) => err ? res.status(500).send(err) : res.status(200).send(result, "successfully created Restaurant!"));
    },
    read(req, res) {
        Restaurant
            .find(req.query)
            .populate('waitlist_id')
            .exec((err, result) => err ? res.status(500).send(err) : res.send(result));
    },
    update(req, res) {
        Restaurant
            .findByIdAndUpdate(req.params.id, req.body, (err, result) => err ? res.status(500).send(err) : res.send(result));
    },
    addItemToMenu(req, res) {
        Restaurant
            .findByIdAndUpdate(req.params.id, {$push: {menu: req.body}})
            .exec((err, result) => err ? res.status(500).send(err) : res.send(result));
    },
    deleteItemToMenu(req, res) {
        Restaurant
            .findByIdAndUpdate(req.params.id, {$pull: {'menu': {'_id': req.body._id}}})
            .exec((err, result) => err ? res.status(500).send(err) : res.send(result));
    },
    getMenuItem(req, res) {
        Restaurant
            .find({'_id': req.params.id})
            .select('menu')
            .exec((err, result) => {
                if (err) {
                    res.status(500).send(err)
                } else {
                    const menu = result[0].menu.filter((menuItem) => {
                        return menuItem._id == req.body.menuId;
                    });
                    res.send(menu)
                }
            });
    },
    delete(req, res) {
        Restaurant
            .findByIdAndRemove(req.params.id, (err, result) => err ? res.status(500).send(err) : res.send(result));
    },
    currentRestId(req, res) {
        Restaurant
            .find({_id: req.params.id})
            //.populate('waitlist_id')
            .exec((err, result) => err ? res.status(500).send(err) : res.send(result));
    },
    updateItemMenu(req, res) {
        Restaurant
            .findOneAndUpdate({'_id': req.params.id, 'menu._id': req.body.menuId}, {
                $set: {
                    'menu.$.title': req.body.menuTitle,
                    'menu.$.description': req.body.menuDescription,
                    'menu.$.price': req.body.menuPrice
                }
            })
            .exec((err, result) => err ? res.status(500).send(err) : res.send(result));
    }

};
