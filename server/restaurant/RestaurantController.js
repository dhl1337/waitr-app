import Restaurant from './RestaurantModel';

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
      .findByIdAndUpdate(req.params.id, {$push: {menu: req.body}}, {new: true}, (err, result) => err ? res.status(500).send(err) : res.send(result));
  },
  deleteItemToMenu(req, res) {
    Restaurant
      .findByIdAndUpdate(req.params.id, {$pull: {'menu': {'_id': req.body._id}}}, {new: true}, (err, result) => err ? res.status(500).send(err) : res.send(result));
  },

  delete(req, res) {
    Restaurant
      .findByIdAndRemove(req.params.id, (err, result) => err ? res.status(500).send(err) : res.send(result));
  },
  currentRestId: function (req, res) {
    Restaurant
      .find({_id: req.params.id})
      //.populate('waitlist_id')
      .exec((err, result) => err ? res.status(500).send(err) : res.send(result));
  }

};
