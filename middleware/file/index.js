const multer = require('multer');

// 圖片上傳
const profileUpload = multer({
  limit: {
    // 限制上傳檔案的大小為 1MB
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(null, false);
    }
    cb(null, true);
  },
});

module.exports = {
  profileUpload,
};
