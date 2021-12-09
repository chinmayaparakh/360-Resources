//Database Schema for user information

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const customer = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique:true
    },
    password: {
        type: String
    },
    message:{
        type: String
    }
})

//Hashing password
customer.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

const Register = new mongoose.model("User",customer);

module.exports = Register;