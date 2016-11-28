import mongoose from 'mongoose';

const WaitlistSchema = mongoose.Schema({
  restaurant_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
  quotedTime: {type: Number},
  list: [{
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    firstName: {type: String/*, required: true*/},
    lastName: {type: String/*, required: true*/},
    partySize: {type: Number/*, required: true*/},
    phone: {type: Number/*, required: true*/},
    timeAdded: {type: Date, default: Date.now()},
    quotedTimeGiven: {type: Number/*, required: true*/},
    notes: {type: String}
  }]

});

module.exports = mongoose.model('Waitlist', WaitlistSchema);
