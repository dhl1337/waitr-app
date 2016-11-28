import Waitlist from '../waitlist/WaitlistModel';
import User from '../user/UserModel';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import Restaurant from '../restaurant/RestaurantModel'

module.exports = {
  register(req, res) {
    const regCust = (req, res) => {
      if (req.body.restaurant_id) {
        req.body.role = 'restaurant';
      }
      const newUser = new User(req.body);
      newUser.password = newUser.generateHash(req.body.password);
      newUser.save((err, user) => {
        if (err)
          res.status(500).send(err);
        else {
          let payload = user.toObject();
          let token = jwt.sign(payload, config.secretKey); // { expiresIn: 600 } expires in 10 minutes
          res.status(200).json({token: token});
        }
      });
    };

    if (req.body.restaurantName) {
      let newRestaurant = new Restaurant({restaurantName: req.body.restaurantName});
      newRestaurant.save((err, restaurant) => {
        if (err)
          res.status(500).send(err);
        else {
          let newWaitlist = new Waitlist({restaurant_id: restaurant._id});
          newWaitlist.save((err, waitlist) => {
            Restaurant.findByIdAndUpdate(restaurant._id, {$set: {waitlist_id: waitlist._id}}, (err, restaurant) => {
              err ? res.status(500).send(err) : req.body.restaurant_id = restaurant._id;
              regCust(req, res);
            });
          });
        }
      });
    } else {
      regCust(req, res);
    }
  },

  login(req, res) {
    User.findOne({email: req.body.email}, (err, user) => {
      if (user) {
        if (!user.validPassword(req.body.password))
          res.status(401).send('Wrong password. Try again');
        else {
          let payload = user.toObject();
          let token = jwt.sign(payload, config.secretKey, {expiresIn: 3600});
          res.status(200).json({token: token});
        }
      }
      else res.status(401).send('User not found');
    });
  }
};
