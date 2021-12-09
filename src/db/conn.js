//Connection to MongoDB database

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://aayush:mittal@cluster0.fe73h.mongodb.net/project?retryWrites=true&w=majority", {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log(`connection successfull`);
}).catch((err) => console.log(`no connection`));