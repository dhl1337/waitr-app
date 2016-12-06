var Mongoose = require('mongoose'),
  bcrypt = require('bcryptjs');

var UserSchema = new Mongoose.Schema({

  firstName: {type: String},
  lastName: {type: String},
  email: {type: String, unique: true},
  password: {type: String},
  phone: {type: Number},
  restaurant_id: {type: Mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
  role: {
    type: String,
    enum: ['user', 'restaurant'],
    default: 'user'
  },
  inWaitList: {type: Mongoose.Schema.Types.ObjectId, ref: 'Waitlist'}

});

UserSchema.set('toObject', {
  transform(doc, ret, options) {
    delete ret.__v;
    delete ret.password;
  }
});

UserSchema.methods.generateHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(8));

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
};

module.exports = Mongoose.model('User', UserSchema);
