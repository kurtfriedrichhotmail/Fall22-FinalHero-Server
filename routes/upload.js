var express = require('express');
var router = express.Router();

const Img = require("../ImgModel");  // bring in the defintion of our "schema"

// using multer to get file from client and save to local file system
const multer = require('multer');

var upload = multer({ dest: 'upload/'});
var fs = require('fs');

/** Permissible loading a single file, 
    the value of the attribute "name" in the form of "recfile". **/
var type = upload.single('newimage');

router.post('/upload', type, function (req,res) {

  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
  var tmp_path = req.file.path;

 /** The original name of the uploaded file
      stored in the variable "originalname". **/
  var target_path = 'upload/' + req.file.originalname;
  
  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function() { 

      var new_img = new Img;
      new_img.img.data = fs.readFileSync(target_path)
      new_img.img.contentType = 'image/jpeg';   // maybe req.file.contentType  might work??
      // I am just making sure all my images have a .jpeg extension
      var newPic;    
      new_img.save(function(err,pic) {
          newPic = pic._id;

          // after writing image to mongo, delete both files from upload dir
          const path = require('path');
          const directory = 'upload';
          fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
              fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
              });
            }
          });

          res.status(200).json({
            success: true,
              document: newPic
            })
          })

      
      });
      src.on('error', function(err) { 
        res.status(500).json({
          error: error,
          })


   });

});

 

const {ObjectId} = require('mongodb'); 

router.get('/image/:id', function(req, res) {
  Img.findOne({_id: ObjectId(req.params.id)}, (err, OneImage) => {
      if (err)
          res.send(err);
      res.contentType('json');
      // console.log(req.params.id);
      // console.log(OneImage);
      res.send(OneImage);
  })
});






module.exports = router;


