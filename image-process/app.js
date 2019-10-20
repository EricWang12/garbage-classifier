const {classify }= require('./classifier.js')

const express = require('express')
const UserRouter = express.Router();

const multer = require('multer')
const bodyParser = require('body-parser')
const crypto = require('crypto')
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


const app = express()
const port = 3000

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

UserRouter.route('/image_upload').post( async (req, res) => {
    let encoded = req.base64;
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
      coordinates : this.coords,
      name : a[0].description,
      category : classify(returnedLabels.map(a => a.description))
    }
    res.json(obj);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

async function detectLabels(fileName) {
    // [START vision_label_detection]
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient({
        keyFilename: 'APIKey.json'
    });

    const [result] = await client.labelDetection(fileName);
    const labels = result.labelAnnotations;
    return labels;
}
