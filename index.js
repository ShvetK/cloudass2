const express = require("express");
const axios = require("axios");
const AWS = require("aws-sdk");
const fs = require("fs");
const app = express();
const port = 5000;

app.use(express.json());

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "ASIAY4OD6TTAS75Z6W6A",
  secretAccessKey: "ooGLzIP+9mgJCDBiwEeEF257knidBcmWeaqSupsU",
  sessionToken:
    "FwoGZXIvYXdzEIn//////////wEaDPVnrxT2WuPmudr+4SLAASXQKSen/+a5LgiFQWOUjx1oPBCjqJ4iDeT8qpxTkAd9+w4XDlqArmZAMu3yBS85vUdO96EAKV0/iEl/DNw8GL9gg39TdlXXD/nEMIQFGcB1iPMyKLP1gm2QSMqBulHw8/UFlMBJhzNSdyZCZ68rd8Ii9ETJi/yzgQqMMCuaUFuhln/ws2mN+qzV7KRR23uJ5+C/JrVZ0gx0Ci/ON1y33S7q3AZRqnpo5KeKgLumQZm5heiLUYPuT1IFyxtw2yLe4yjJmuWfBjItSfikS92mT9sTxTNx2Bl8KggpnK41pxpw/XBOXVhxQqpWddEh0PRBdxMU5P1P",
});

const s3 = new AWS.S3();

var bucketName = "shvet-try-1";
var myKey = "file.txt";

// app.get("/", (req, res) => {
//     res.send("Hello World! My name is Shvet");
// });

const robURL = "http://52.91.127.198:8080/start";

axios({
  method: "post",
  url: robURL,
  data: {
    banner: "B00917946",
    ip: "35.153.52.64:5000",
  },
}).then(function (res) {
  response.status(200).send(res.data);
});

// Create a file
app.post("/storedata", (req, res) => {
  const newData = req.body.data;
  const params = { Bucket: bucketName, Key: myKey, Body: newData };
  s3.upload(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("File uploaded Successfully", data.Location);
      const urlR = data.Location;
      res.status(200).send({ s3uri: urlR });
    }
  });
});

// append data in the file
app.post("/appenddata", (req, res) => {
  const appendContent = req.body.data;

  var getParams = {
    Bucket: bucketName,
    Key: myKey,
  };

  s3.getObject(getParams, function (err, data) {
    if (err) console.log(err, err.stack);
    else {
      const updatedData = data.Body.toString() + appendContent;
      const params = {
        Bucket: bucketName,
        Key: myKey,
        Body: updatedData,
      };

      s3.upload(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
          console.log("File updated!");
          res.sendStatus(200);
        }
      });
    }
  });
});

// delete file
app.post("/deletefile", (req, res) => {
  const deleteUrl = req.body.data;

  var params = { Bucket: bucketName, Key: myKey };

  s3.deleteObject(params, function (err, data) {
    if (err) {
      console.log(err, err.stack); // error
    } else {
      res.sendStatus(200);
      console.log("Success!", data);
    }
  });
  res.status(200);
});

app.listen(port, () => {
  console.log(`Your app listening on port ${port}`);
});
