const express = require('express');
const axios = require('axios');
const AWS = require('aws-sdk')
const fs = require('fs');
const app = express();
const port = 5000;

app.use(express.json());

AWS.config.update({
    region:'us-east-1',
    accessKeyId: "ASIAY4OD6TTAUFSHEQFE",
    secretAccessKey: "WQoQyiwPCCntSc0PotlxCwftDqHOTu9CLKveLtFN",
    sessionToken: "FwoGZXIvYXdzEH8aDBjfI9Zm8KVzE9C1fyLAAfmhuHDskXU3Q6PRsI58Vaxa0kxmBIYxReRXCYE9sN8QOrS3j5DJPsJRhGX+KCaHiu+isIDunQ+BQItipc5b+Xt50IUe327FneRIP6Dv83d9izqJg7bNrtr62YOnGSToRhKhgCmVsw1Ub4Pb2bV0tBKtzHj+DR6I/kxzJBTnIg4UbIZH2Ht9SkGGHb+21eJbYU5tt8rSH+XTlrtGCq1wzlEkXNR+CSuNaDP0gfGxlRRdvADs4IziEXUcXIeY4/3MhCj7geOfBjItIEJf4kbsA9FSfgE+y2rU41l5nLwQpLPTTGr/B4aEe4Ksd+T1KJToLEZWEbqJ"
})

const s3 = new AWS.S3();

var bucketName = "shvet-try-1";
var myKey = 'file.txt';

app.get("/", (req, res) => {
    res.send("Hello World! My name is Shvet");
});


const urlS = 'http://52.91.127.198:8080/start';

        axios({
          method: "post",
          url: urlS,
          data: {banner: "B00917946",
          ip: "54.160.102.179"
        }
        })
        .then(function(res){
          response.status(200).send(res.data)
        })



// Create a file
app.post("/storedata", (req, res)  => {
    const newData = req.body.data;
    const params = {Bucket: bucketName, Key: myKey, Body: newData};
    s3.upload(params, function(err,data) {
    if (err){
        console.log(err);
    }
    else{
        console.log("Success!");
    }
    res.status(200);
    res.json({
        "s3uri": "https://shvet-try-1.s3.amazonaws.com/file.txt"
    });
});
});


// append data in the file
app.post("/appenddata", (req, res)  => {

    const appendContent = req.body.data;

    var getParams = {
        Bucket: bucketName, 
        Key: myKey
    };

    s3.getObject(getParams, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
            const updatedData = data.Body.toString() + appendContent;
            const params = {
                Bucket: bucketName,
                Key: myKey,
                Body: updatedData};

            s3.upload(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     {
                    console.log('Success updated.');
                   // successful response
                }
             });
        }
        res.status(200);
        res.json({
            s3uri: "https://shvet-try-1.s3.amazonaws.com/file.txt"
        });
    }); 
});

// delete file
app.post("/deletefile", (req, res)  => {

    const deleteUrl = req.body.data;


    var params = {  Bucket: bucketName, Key: myKey };

    s3.deleteObject(params, function(err, data) 
    {
        if (err) 
        {
            console.log(err, err.stack); // error
        }  
        else
        {
            console.log("Successfully Deleted");// deleted
        }                
    });
    res.status(200);
});

app.listen(port, () => {
    console.log(`Your app listening on port ${port}`)
})