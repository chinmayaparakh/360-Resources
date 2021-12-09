const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
        coordinates: []
    
});

module.exports = Location = mongoose.model('Location', LocationSchema);

