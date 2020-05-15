const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
    
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Wrong filetype'), false);
    }
}

module.exports = multer({
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 20
    }, 
    fileFilter: fileFilter
  });