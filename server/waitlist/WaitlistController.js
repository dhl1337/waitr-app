import Waitlist from './WaitlistModel';
import User from '../user/UserModel';

const findBy_Id = (list, id) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i]._id.toString() === id) {
      return i;
    }
  }
};

module.exports = {
  create(req, res) {
    Waitlist.create(req.body, (err, result) => err ? res.status(500).send(err) : res.status(200).send(result, "successfully created Waitlist!"));
  },
  read(req, res) {
    Waitlist
      .find(req.query)
      .exec((err, result) => err ? res.status(500).send(err) : res.send(result));
  },
  update(req, res) {
    Waitlist.findByIdAndUpdate(req.params.id, req.body, err => {
      err ? res.status(500).send(err) :
        Waitlist.findById(req.params.id, (err, result) => err ? res.status(500).send(err) : res.send(result));
    });
  },
  delete(req, res) {
    Waitlist.findByIdAndRemove(req.params.id, (err, result) => err ? res.status(500).send(err) : res.send(result));
  },
  addToList(req, res) {
    Waitlist.findById(req.params.id, (err, waitList) => {
      //if there is an error, don't try to update anything
      if (err || !waitList) {
        return res.status(500).send(err);
      }
      waitList.list.push(req.body);
      waitList.save();

      //NEW CODE!!!!

      res.send(waitList.list[waitList.list.length - 1]);
    });
  },
  removeFromList(req, res) {
    Waitlist.findById(req.params.id, (err, waitList) => {
      if (err) {
        return res.status(500).send(err);
      }
      //find the position of the list item
      const pos = findBy_Id(waitList.list, req.params.listId);

      const removed = waitList.list.splice(pos, 1);

      waitList.save();

      if (removed[0].user_id) {
        User.findById(removed[0].user_id, (err, user) => {
          err ? res.status(500).send(err) :
          user.inWaitList = undefined;
          user.save((err) => err ? console.error(err) : console.log("successfully removed property"));
        })
      }

      res.send({pos: pos});
    })
  },
  getFromList(req, res) {
    Waitlist.findById(req.params.id, (err, waitList) => {
      const pos = findBy_Id(waitList.list, req.params.listId);

      err ? res.status(500).send(err) : res.send(waitList.list[pos]);
    })
  },
  updateListEntry(req, res) {
    Waitlist.findById(req.params.id, (err, waitList) => {

      const pos = findBy_Id(waitList.list, req.params.listId);

      for (let p in req.body) {
        waitList.list[pos][p] = req.body[p];
      }

      err ? res.status(500).send(err) : waitList.save((err, result) => err ? res.send(err) : res.send(result));
    })
  }
};
