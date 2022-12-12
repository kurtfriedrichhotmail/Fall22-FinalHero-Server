var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ImgSchema = new Schema({
    img: { data: Buffer, contentType: String}
}, 
{
    timestamps: true
},
{ collection: 'ImageCollection' }

);



module.exports = mongoose.model('Img', ImgSchema);

// https://medium.com/@colinrlly/send-store-and-show-images-with-react-express-and-mongodb-592bc38a9ed

