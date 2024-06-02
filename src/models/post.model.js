const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    geoLocation: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
