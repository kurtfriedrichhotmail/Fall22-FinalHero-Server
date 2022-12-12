const mongoose = require("mongoose");

// here we define a schema for our document database
// mongo does not need this, but using mongoose and requiring a 
// schema will enforce consistency in all our documents (records)
const Schema = mongoose.Schema;

const HeroSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  picID: {
    type: String,
    required: false
  }
//   _id: {   mongo provides this
//     type: String,
//     required: false
//   }

},
{ collection: 'HeroCollection' }
);

module.exports = mongoose.model("Hero", HeroSchema);

