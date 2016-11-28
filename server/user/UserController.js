var User = require('./UserModel');

module.exports = {

  read(req, res) {
    User
      .find(req.query)
      .exec((err, result) => err ? res.status(500).send(err) : res.send(result));
  },

  update(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, result) => err ? res.status(500).send(err) : res.send(result));
  },

  delete: function (req, res) {
    User.findByIdAndRemove(req.params.id, (err, result) => err ? res.status(500).send(err) : res.send(result));
  },

  currentUser: function (req, res) {
    User
      .find({_id: req.params.id})
      .populate('inWaitList')
      .exec((err, result) => err ? res.status(500).send('failed to find') : res.json(result));
  },

};
