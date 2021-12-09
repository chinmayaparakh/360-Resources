const express = require('express');
const mongoose=require('mongoose');
const bcrypt = require("bcryptjs");
const app = express();
app.set("view engine","ejs")

//Connection to MongoDB Database
require("./db/conn");
const port = process.env.PORT || 3000
const db=mongoose.connection;


//Connection to models
const Register = require("./models/sign_up")
//const Map= require("./models/map")


//Connection to html file's folder
app.use(express.json())//parse the incoming data
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))


//Storing Sing Up information into database
app.post("/sign_up",async (req,res)=>{
    try {
    const register= new Register({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    const registered = await register.save()
    return res.redirect('front_page.html')
    } catch(error){
        res.write("<script> alert('EMAIL ALREADY TAKEN');window.location='signup.html'; </script>");
    }
})


/*Redirecting to sign up and sign in page
app.get("/sign_up", (req, res) => {
     res.redirect('signup.html');
}); 
app.get("/sign_in", (req, res) => {
    res.redirect('signin.html');
}); 
app.get("/search", (req, res) => {
    res.redirect('index1.html');
}); */

//Comparing Sign In information from database
app.post("/sign_in", async function (req, res) {
    try{
        const mail = req.body.email;
        const user = await Register.findOne({email:mail});
        const check = await bcrypt.compare(req.body.password,user.password);  
        if(check){
                res.redirect('front_page.html'); 
            } else{
                res.write("<script> alert('INCORRECT PASSWROD');window.location='signin.html'; </script>");
            }
        
    } catch(error){
        res.write("<script> alert('INVALID EMAIL');window.location='signin.html'; </script>");  
    }

}); 

//Site Running on port
app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});



//Storing suggtions from Users
app.post("/suggest",async function(req,res){
    try{
    const mail = req.body.email;
    const msg = req.body.message;
    db.collection("users").updateOne(
        { "email" : mail }, // specifies the document to update
        {
          $set: {  "message": msg}
        })
    res.redirect("front_page.html")
    } catch(error){
        res.write("<script> alert('INVALID EMAIL');window.location='front_page.html'; </script>");  
    }
})


//Storing User location into Database
const History = require("./models/location")

app.post("/api", async function(req,res){
    try {
        const history= await new History({
                coordinates:[req.body.lat, req.body.lon]
        })
        await history.save()
        } catch(error){
            res.write("<script> alert('Loaction Access not Given');window.location='index1.html'; </script>");
        }
})


//Performing Radius Search in Database
const User = require('./models/map')

async function radiusSearch(cat,rad){
    const coor = await db.collection("locations").findOne({}, {sort:{$natural:-1}});
    const data =  User.aggregate([{
        $geoNear:{
            near:{
                type:"Point",
                coordinates:[coor.coordinates[0],coor.coordinates[1]] //28.6297, 77.3721 (test data)
            },
            maxDistance: Number(rad) ,
            distanceField: "Distance",
            spherical: true,
            query:{ "category" : cat}
        }
    }])
    console.log(coor,data)
    return data;
    }
    

//Returning Data from Database to Web Page

//Shopping Mall
app.post("/search", async function (req, res) {
    try{
    const radius = req.body.radius || 3000;
        const ans= await radiusSearch('Shopping mall',radius)
        if(ans.length!==0){
            res.render("output",{out: ans})
            }
            else{
                res.write("<script> alert('No Shopping Mall found within given Radius. Re-Enter Radius(in Meters)');window.location='index1.html'; </script>");
            }
        
    } catch(err){
        console.log(err)
    }
      
})

//Plumber
app.post("/search1", async function (req, res) {
    try{
        const radius = req.body.radius || 3000;
            const ans= await radiusSearch('Plumber',radius)
            if(ans.length!==0){
                res.render("output",{out: ans})
                }
                else{
                    res.write("<script> alert('No Plumber found within given Radius. Re-Enter Radius(in Meters)');window.location='index1.html'; </script>");
                }
        } catch(err){
            console.log(err)
        }
})

//Electric Consultant
app.post("/search2", async function (req, res) {
    try{
        const radius = req.body.radius || 3000;
            const ans= await radiusSearch('Electric Consultant',radius)
            if(ans.length!==0){
                res.render("output",{out: ans})
                }
                else{
                    res.write("<script> alert('No Electric Consultant found within given Radius. Re-Enter Radius(in Meters)');window.location='index1.html'; </script>");
                }   
        } catch(err){
            console.log(err)
        }
})

//Restaurant
app.post("/search3", async function (req, res) {
    try{
        const radius = req.body.radius || 3000;
            const ans= await radiusSearch('Restaurant',radius)
            if(ans.length!==0){
                res.render("output",{out: ans})
                }
                else{
                    res.write("<script> alert('No Restaurant found within given Radius. Re-Enter Radius(in Meters)');window.location='index1.html'; </script>");
                }

        } catch(err){
            console.log(err)
        }
})

//Coaching Center
app.post("/search4", async function (req, res) {
    try{
        const radius = req.body.radius || 3000;
        const ans= await radiusSearch(' Coaching Center',radius);
        if(ans.length!==0){
            res.render("output",{out: ans})
            }
            else{
                res.write("<script> alert('No Coaching Center found within given Radius. Re-Enter Radius(in Meters)');window.location='index1.html'; </script>");
            }
            
        } catch(err){
            console.log(err)
        }
})

//Food Stall
app.post("/search5", async function (req, res) {
    try{
        const radius = req.body.radius || 3000;
            const ans= await radiusSearch('Food stall',radius)
            if(ans.length!==0){
                res.render("output",{out: ans})
                }
                else{
                    res.write("<script> alert('No Food Stall found within given Radius. Re-Enter Radius(in Meters)');window.location='index1.html'; </script>");
                }
        } catch(err){
            console.log(err)
        }
})

//Cobbler
app.post("/search6", async function (req, res) {
    try{
        const radius = req.body.radius || 3000;
            const ans= await radiusSearch('Cobbler',radius)
            if(ans.length!==0){
                res.render("output",{out: ans})
                }
                else{
                    res.write("<script> alert('No Cobbler found within given Radius. Re-Enter Radius(in Meters)');window.location='index1.html'; </script>");
                }
        } catch(err){
            console.log(err)
        }
})

//Cinema
app.post("/search7", async function (req, res) {
    try{
        const radius = req.body.radius || 3000;
            const ans= await radiusSearch('Cinema',radius)
            if(ans.length!==0){
                res.render("output",{out: ans})
                }
                else{
                    res.write("<script> alert('No Cinema found within given Radius. Re-Enter Radius(in Meters)');window.location='index1.html'; </script>");
                }
        } catch(err){
            console.log(err)
        }
})

//Tailor
app.post("/search8", async function (req, res) {
    try{
        const radius = req.body.radius || 3000;
            const ans= await radiusSearch('Tailor',radius)
            if(ans.length!==0){
                res.render("output",{out: ans})
                }
                else{
                    res.write("<script> alert('No Tailor found within given Radius. Re-Enter Radius(in Meters)');window.location='index1.html'; </script>");
                }
        } catch(err){
            console.log(err)
        }
})