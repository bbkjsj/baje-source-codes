const moment = require('moment');
const uploadPath = 'public/data/uploads/';
const multer = require('multer');
const fileException = require("../exceptionTypes/file");

const uploadMimeTypes = [
    'image/jpg',
    'image/jpeg',
    'image/png'
];
const fileFormat = (id,mimeType = uploadMimeTypes[0]) => `subordinate_${id}_${moment().format('YYYY-MM-DD_HH_mm_ss')}.${mimeTypeToFileExt(mimeType)}`

const mimeTypeToFileExt = (mimetype) => {
    switch (mimetype) {
        case 'image/jpg':
        case 'image/jpeg':
            return 'jpg';
            break
        case 'image/png':
            return 'png';
            break;
        default:
            return 'jpg';
            break
    }

}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, fileFormat(req.body.subordinateId, file.mimetype))
    },
})
const fileFilter = function (req, file, cb) {
    if (!uploadMimeTypes.includes(file.mimetype)) {
        return cb(null, false,fileException.NO_FILE_UPLOAD);
    }
    cb(null, true);
}
const upload = multer({ storage,fileFilter })

module.exports = {
    uploadPath,
    uploadMimeTypes,
    fileFormat,
    mimeTypeToFileExt,
    upload,
}
