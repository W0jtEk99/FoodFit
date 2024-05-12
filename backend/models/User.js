const { Schema, model } = require("mongoose");
const {UsersActivitiesSchema} = require('./UsersActivities')

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    activities: [UsersActivitiesSchema]


});

const User = model("user", userSchema);

module.exports = User;
