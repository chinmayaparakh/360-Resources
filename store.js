
const mongoose = require('mongoose');
//const Map = require("./src/models/map");

//Storing locations into database
const fs = require("fs");
const fastcsv = require("fast-csv");


let stream = fs.createReadStream("Dataset/32.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push({
      name: data[0],
      address: data[1],
      category: data[4],
      location:{
        type:"Point",
        coordinates: [Number(data[2]),Number(data[3])]
        }
    });
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    console.log(csvData);
    mongoose.connect("mongodb+srv://chinmaya:parakh@cluster0.ruf7k.mongodb.net/minor?retryWrites=true&w=majority", {
      useNewUrlParser:true,
      useUnifiedTopology:true
  }).then(() => {
      console.log(`connection successfull`);
  }).catch((err) => console.log(`no connection`));
  const db=mongoose.connection;
          db.collection("resources").insertMany(csvData, (err, res) => {
            if (err) throw err;

            console.log(`Inserted: ${res.insertedCount} rows`);
    
          });
  });

stream.pipe(csvStream);
