const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');
const { Readable } = require('stream');

// 圖片上傳
const profileUpload = multer({
  limit: {
    // 限制上傳檔案的大小為 1MB
    fileSize: 1000000,
  },
});

const aws = {
  accessKeyId: 'xxxxxxxxx',
  secretAccessKey: 'xxxxxxxx',
  bucket: 'xxxxxxx/file',
  // bucket: 'test-blog-storage/upload/aaa',
  acl: 'private', // private , public-read
};

AWS.config.credentials = {
  accessKeyId: aws.accessKeyId,
  secretAccessKey: aws.secretAccessKey,
};
AWS.config.region = 'ap-northeast-2';
const s3Client = new AWS.S3();

//上傳檔案
router.put(
  '/upload-file',
  profileUpload.single('file'),
  async function (req, res, next) {
    const file = req.file;

    const params = {
      Bucket: aws.bucket,
      Key: file.originalname,
      Body: file.buffer,
      ACL: aws.acl,
      ContentType: file.mimetype,
    };
    await s3Client.upload(params, null, (uploadErr, data) => {
      if (uploadErr) {
        console.log(uploadErr);
      } else {
        console.log(data.Location);
      }
    });
  },
);

//讀取檔案
router.get(/file/, async function (req, res, next) {
  const path = req.path.replace('/file/', '');
  const params = {
    Bucket: aws.bucket,
    // Key: file.originalname,
    Key: path,
  };
  await s3Client.getObject(params, function (err, data) {
    if (err) {
      console.log('get err', err);
    } else {
      console.log('get success', data);
      const buffer = data.Body;
      return Readable.from(buffer).pipe(res);
    }
  });
});

module.exports = router;
