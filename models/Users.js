const express           = require('express');
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

//Creating the Schema
const UserSchema = new Schema ({
    googleID: {
        type: String
    },
    email: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    }, 
    image: {
        type: String
    }
})

module.exports = mongoose.model ('User', UserSchema);