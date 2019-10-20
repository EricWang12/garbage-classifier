const {classify }= require('./classifier.js')

const express = require('express')
const multer = require('multer')
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

app.post('/upload', upload.single('photo'), async (req, res) => {

    var imageFile = fs.readFileSync(fileLocation + '/' + req.file.originalname);
    var encoded = Buffer.from(imageFile).toString('base64');
    //console.log(encoded);

    var pic = new Buffer.from(encoded, 'base64');
    var [labelResults] = await client.labelDetection(pic);
    var [objectResults] = await client.objectLocalization(pic);
    var objects = objectResults.localizedObjectAnnotations;

    var returnedLabels = labelResults.labelAnnotations;
    //console.log(returnedLabels.map(a => a.description));

    res.send(returnedLabels.map(a => a.description) + '<br>' + classify(returnedLabels.map(a => a.description)));
    //res.send(returnedLabels);

}
);



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
