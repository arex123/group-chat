const AWS = require("aws-sdk");

function uploadToS3(fileName,fileData) {

  let instance = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
  });


  var params = {
    Bucket: process.env.BUCKET_NAME,
    Key: 'chatImages/'+ fileName,
    Body: fileData,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    instance.upload(params, (err, s3InstaceResponse) => {
      if (err) {
        console.log("in s3 file err",err)
        reject("Something went wrong", err);
      } else {
        console.log("s2 res ", s3InstaceResponse);
        resolve(s3InstaceResponse.Location);
      }
    });
  });
}

module.exports = {
    uploadToS3
}