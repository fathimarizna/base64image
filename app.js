const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const mime = require('mime');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const uploadImage = async (req, res, next) => {
  try {
    console.log(req.body);
    var matches = req.body.base64image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    response = {};
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.getExtension(type);
    let fileName = 'image.' + extension;

    fs.writeFileSync("/uploads" + fileName, imageBuffer);
    return res.send({ "status": "success" });
  } catch (e) {
    // return res.send({"status":"failed"})
    next(e);
  }
}
app.post('/upload/image', uploadImage);
app.listen(3000, () => {
  console.log('app is running on port 3000');
})
