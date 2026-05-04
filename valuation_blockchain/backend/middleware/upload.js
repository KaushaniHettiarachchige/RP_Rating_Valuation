const multer = require('multer');

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per file

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_UPLOAD_SIZE_BYTES },
    fileFilter: (req, file, cb) => {
        const isImage = file.mimetype && file.mimetype.startsWith('image/');
        const isDoc = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.mimetype);

        if (file.fieldname === 'ownershipDocs') {
            if (isImage || isDoc) return cb(null, true);
            return cb(new Error('Invalid ownership document type.'));
        }

        if (file.fieldname === 'propertyImages') {
            if (isImage) return cb(null, true);
            return cb(new Error('Invalid property image type.'));
        }

        return cb(new Error('Unexpected upload field.'));
    },
});

module.exports = {
    upload,
    MAX_UPLOAD_SIZE_BYTES,
};
