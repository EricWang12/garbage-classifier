//const {detectLabels }= require('./detect.js')

const express = require('express')
const multer = require('multer')
const crypto = require('crypto')

var fs = require('fs');
var imageFile = fs.readFileSync('./mouse.png');

// Convert the image data to a Buffer and base64 encode it.
var encoded = Buffer.from(imageFile).toString('base64');

console.log(encoded);

var pic = new Buffer(encoded, 'base64');

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


app.get('/', (req, res) => res.send('Hello World!'))

app.post('/upload', upload.single('photo'), async (req, res) => {

    var returnedLabels = await detectLabels(pic);
    res.send(returnedLabels.map(a => a.description));
    //res.send(returnedLabels);

    // if(req.file) {
    //     res.json(req.file);
    // }
    // else throw 'error';
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
    // console.log('Labels:');
    // labels.forEach(label => console.log(label.description));
    // [END vision_label_detection]
}
