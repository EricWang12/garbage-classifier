const {classify }= require('./classifier.js')

const express = require('express')
const UserRouter = express.Router();

const multer = require('multer')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const mongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb+srv://zwang772:Aa012345%3F@cluster0-bc7hw.gcp.mongodb.net/test?retryWrites=true&w=majority";
const fs = require('fs');
const vision = require('@google-cloud/vision');
// Creates a client

const client = new vision.ImageAnnotatorClient({
    keyFilename: 'APIKey.json'
});

// Convert the image data to a Buffer and base64 encode it.


const fileLocation =  __dirname + '/uploads/images';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,fileLocation)
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(null, file.originalname + "");
      });
    }
  });
const upload = multer({ storage: storage });

// mongoClient.connect(mongoUrl, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("Cluster0");

//   dbo.collection("database").insertMany(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("Number of documents inserted: " + res.insertedCount);
//     db.close();
//   });
//   db.close();
// });



const app = express()
const port = 8080

app.use(express.static('public'));
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({ extended: true ,limit: '500mb'}));

app.post('/upload', upload.single('photo'), async (req, res) => {

    let imageFile = fs.readFileSync(fileLocation + '/' + req.file.originalname);
    let encoded = Buffer.from(imageFile).toString('base64');
    console.log(encoded);

    let pic = new Buffer.from(encoded, 'base64');
    let [labelResults] = await client.labelDetection(pic);
    let [objectResults] = await client.objectLocalization(pic);
    let objects = objectResults.localizedObjectAnnotations;

    let returnedLabels = labelResults.labelAnnotations;
    //console.log(returnedLabels.map(a => a.description));

    let coords = new Array();

    //.get(0).map(v => `x: ${v.x}, y:${v.y}`);
    let vertices = objects[0].boundingPoly.normalizedVertices;
    vertices.forEach(v => coords.push([v.x,v.y]));

    res.send(coords + '<br>' + returnedLabels.map(a => a.description) + '<br>' + classify(returnedLabels.map(a => a.description)));
    //res.send(returnedLabels);

}
);

app.post('/imageUpload', async (req, res) => {
    let encoded = req.body.base64;
    console.log(typeof(encoded));
    let pic = new Buffer.from(encoded, 'base64');
    let [labelResults] = await client.labelDetection(pic);
    let [objectResults] = await client.objectLocalization(pic);
    let objects = objectResults.localizedObjectAnnotations;

    let returnedLabels = labelResults.labelAnnotations;
    //console.log(returnedLabels.map(a => a.description));

    let coords = new Array();

    //.get(0).map(v => `x: ${v.x}, y:${v.y}`);
    let vertices = objects[0].boundingPoly.normalizedVertices;
    vertices.forEach(v => coords.push([v.x,v.y]));

    let obj = {
      coordinates : coords,
      name : returnedLabels[0].description,
      category : classify(returnedLabels.map(a => a.description))
    }
    res.json(obj);
});


app.post('/confirmGarbage', async (req, res) => {
  let category = req.body.category;
  
  let totalCount = await addOne(category);
  console.log(totalCount);
  let obj = {
    count : totalCount,
    time : new Date()
  }
  res.json(obj);


});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


function mongoInit(){
  mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, function(err, client) {
  if(err) {
      console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
  }
  console.log('Connected...');
  const collection = client.db("Cluster0").collection("database");
  var target = { address: /^/ };
  var myobj = {$set: {count : 0}} ;
    collection.updateMany(target , myobj, function(err, res) {
    if (err) throw err;
    //console.log("Number of documents inserted: " + res.insertedCount);
    client.close();
    });
    // perform actions on the collection object

  });
}


async function addOne(category){

  var client = await mongoClient.connect(mongoUrl, {useUnifiedTopology: true })
  .catch(err => { console.log(err); });

  let collection = await client.db("Cluster0").collection("database");

  collection.find({"name" : category}).toArray(function(err, result) {
    if (err) throw err;
    let newvalues = { $set: {Count: result[0].Count + 1 } };
    let count = result[0].Count + 1;
    
    collection.updateOne({name : category}, newvalues , function(err, res) {
    });
  });
  let result =  await  collection.findOne({"name" : category})
  console.log(result.Count );
  return result.Count ;
}

