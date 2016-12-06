var Mongoose = require('mongoose'),
    HoursSchema = ('./HoursSchema');
// = require('./MenuSchema');

var RestaurantSchema = new Mongoose.Schema({
    restaurantName: {type: String, default: 'restaurant name'},
    addressLineOne: {type: String, default: 'restaurant address line one'},
    addressLineTwo: {type: String, default: 'restaurant address line two'},
    city: {type: String, default: 'restaurant city'},
    state: {type: String, default: 'restaurant state'},
    zipcode: {type: String, default: 'restaurant zip'},
    location: {type: String, default: 'restaurant location'},
    shortDescription: {type: String, default: 'restaurant short description'},
    description: {type: String, default: 'restaurant description'},
    foodType: {type: String, default: 'food type'},
    hours: {
        monday: {
            openTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")},
            closeTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")}
        },
        tuesday: {
            openTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")},
            closeTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")}
        },
        wednesday: {
            openTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")},
            closeTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")}
        },
        thursday: {
            openTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")},
            closeTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")}
        },
        friday: {
            openTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")},
            closeTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")}
        },
        saturday: {
            openTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")},
            closeTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")}
        },
        sunday: {
            openTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")},
            closeTime: {type: Date, default: Date("1970-01-01T07:00:00.000Z")}
        }
    },
    menu: [{
        item: {type: String/*, required: true*/},
        desc: {type: String/*, required: true*/},
        price: {type: Number/*, required: true*/},
        section: {type: String}
    }],
    waitlist_id: {type: Mongoose.Schema.Types.ObjectId, ref: 'Waitlist'},
    restaurantImage: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvZGMAYzv-fa02MiXyKWJ4ITUvAOyrEhAEMKkXB_30gaTdPNrZ9A'
    },
    restaurantIcon: {type: String, default: '../img/logo.svg'},
    restaurantWebsite: {type: String, default: 'www.apple.com'},
    restaurantPhone: {type: String, default: '1231231234'}

});

module.exports = Mongoose.model('Restaurant', RestaurantSchema);
