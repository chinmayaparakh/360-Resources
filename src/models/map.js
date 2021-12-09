const mongoose = require('mongoose');

const MapSchema = new mongoose.Schema({
    name: {
        type: String
    },
    address: {
        type: String,
    },

    location: {
        type: {
            type: String
        },
        coordinates: []
    },
    category: {
        type: String
    },
});

MapSchema.index({ location: "2dsphere" });
//module.exports = Map
module.exports = Resource = mongoose.model('Resource', MapSchema);

module.exports.getUserById = (id, callback) => {
    Map.findById(id, callback);
}

module.exports.getUserByCategory = (category, callback) => {
    let query = {category: category};
    Map.findOne(query, callback);
}
