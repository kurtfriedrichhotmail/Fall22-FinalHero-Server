var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");
const HeroSchema = require("../HeroSchemaFile");  // bring in the defintion of our "schema"
const User = require("../User");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (TaskDB)
const dbURI =  process.env.MONGO_CS;
   //"mongodb+srv://bcuser:bcuser@cluster0-nbt1n.mongodb.net/ToDosDB?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);


/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
});



// for this version, we will keep data on server in an array
heroArray = [];

//constructor
function Hero(pId, pName, pOwner) {
  this.id= pId;
  this.name = pName;
  this.owner = pOwner;
  }

/* GET all Heros . */
router.get('/heroes', function(req, res) {
  HeroSchema.find({}, (err, AllHeros) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    heroArray  = AllHeros;
    console.log(heroArray);
    res.status(200).json(heroArray);
  });
});

/* GET one Hero . */
router.get('/heroes/:id', function(req, res) {
  HeroSchema.find({id: req.params.id}, (err, OneHero) => {
    console.log('Gethero id ' + req.params.id);
    if(err){
        res.status(500).send("no such id");
    }
    else {
      console.log(OneHero);
    res.status(200).json(OneHero[0]);  // mongo returns an array
    }
  
    });
  });

  /* GET Heros for one user . */
router.get('/heroesSubset/:id', function(req, res) {
  HeroSchema.find({owner: req.params.id}, (err, HeroSubset) => {
    console.log('GetheroSubset authorID ' + req.params.id);
    if(err){
        res.status(500).send("no such author");
    }
    else {
      console.log(HeroSubset);
    res.status(200).json(HeroSubset);  // mongo returns an array
    }
  
    });
  });


  router.put('/heroes/:id', function(req, res) {
    var changedHero = req.body; 
    let whichHero = req.params.id;
    console.log(whichHero);
    console.log(changedHero);

    HeroSchema.updateOne({id: whichHero}, 
      {name: changedHero.name, color: changedHero.color, picID: changedHero.picID}, function(err, docs){
      if (err) {
        res.status(500).send(err);
      }
      else {
        res.status(200).json("success");
      }
    });
  });




// delete is used to delete existing object
router.delete('/heroes/:id', function(req, res) {
  let delID =  req.params.id;
  HeroSchema.deleteOne({ id: delID }, function (err, ) {
    if (err) {
      console.log("delete failed");
      res.status(500).send(err);
    }
    else {
      res.status(200).json('deleted hero');
    }
  })

});



router.post("/newHero", function(req, res) {
// should verify hero name not already in DB
let oneNewHero = new HeroSchema(req.body);  
console.log(oneNewHero);
oneNewHero.save((err, heroValue) => {
  if (err) {
    res.status(500).send(err);
  }
  else {
  console.log(heroValue);
  res.status(201).json(heroValue);  // returns the new object from mongo
  }
});
});

//******************************************* */
//  userdata routes
//****************************************** */







/* post a new User and push to Mongo */
router.post('/newuser', function(req, res) {
// should verify user name not already in DB
  let oneNewuser = new User(req.body);  
  console.log(req.body);
  console.log(oneNewuser);
  oneNewuser.save((err, userValue) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
    console.log(userValue);
    res.status(201).json(userValue);
    }
  });
});


/* using post to pass name - pw and return the object with _id if found */
router.post('/loginUser', function(req, res) {
  let findName = req.body.userName;  
  let findpw = req.body.pw;  
  console.log(findName + " -- " + findpw);
  User.find(
    { userName: findName, pw: findpw },  
    { completed: true },   // ignore the value of the object's completed prop, just force it to true
    { new: false }, // if it does not find one, do not just make up a new one.
    (err, data) => {
      if (err) {
        res.status(500).send(err);
    }
    if(data[0] != null) {
      console.log("id found " + data); // mongo does not complain if not found!
      res.status(200).json(data[0]._id);
    }
    else {
      console.log("not found");
      var notfound = 0;
      res.status(200).json(notfound);
    }
    })
});


module.exports = router;
