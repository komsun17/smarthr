const { body, validationResult } = require('express-validator');

// Middleware สำหรับตรวจสอบผลลัพธ์ของ validation
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // สำหรับ AJAX requests
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        // สำหรับ form submissions
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).send('Validation Error: ' + errorMessages.join(', '));
    }
    
    next();
};

// Validation rules สำหรับ Hotel
exports.validateHotel = [
    body('hotelName')
        .notEmpty()
        .withMessage('กรุณาระบุชื่อโรงแรม')
        .isLength({ min: 2, max: 100 })
        .withMessage('ชื่อโรงแรมต้องมีความยาว 2-100 ตัวอักษร')
        .trim()
        .escape(),
    
    body('roomNumber')
        .notEmpty()
        .withMessage('กรุณาระบุหมายเลขห้อง')
        .isLength({ min: 1, max: 10 })
        .withMessage('หมายเลขห้องต้องมีความยาว 1-10 ตัวอักษร')
        .trim()
        .escape()
];

// Validation rules สำหรับ HIP Carpark
exports.validateHipCarpark = [
    body('plateNumber')
        .notEmpty()
        .withMessage('กรุณาระบุหมายเลขทะเบียน')
        .isLength({ min: 1, max: 10 })
        .withMessage('หมายเลขทะเบียนต้องมีความยาว 1-10 ตัวอักษร')
        .matches(/^[ก-ฮA-Za-z0-9\s\-]{1,10}$/)
        .withMessage('หมายเลขทะเบียนไม่ถูกต้อง')
        .trim()
        .escape(),
    
    body('parkingSlot')
        .notEmpty()
        .withMessage('กรุณาระบุช่องจอดรถ')
        .isAlphanumeric()
        .withMessage('ช่องจอดรถต้องเป็นตัวอักษรและตัวเลขเท่านั้น')
        .isLength({ min: 1, max: 10 })
        .withMessage('ช่องจอดรถต้องมีความยาว 1-10 ตัวอักษร')
        .trim()
        .escape(),
    
    body('entryTime')
        .optional()
        .isISO8601()
        .withMessage('รูปแบบเวลาไม่ถูกต้อง')
];

// Validation rules สำหรับ HIP Finger Scan
exports.validateHipFingerScan = [
    body('employeeId')
        .optional()
        .isNumeric()
        .withMessage('รหัสพนักงานต้องเป็นตัวเลข')
        .isLength({ min: 1, max: 10 })
        .withMessage('รหัสพนักงานต้องมีความยาว 1-10 หลัก'),
    
    body('scanTime')
        .optional()
        .isISO8601()
        .withMessage('รูปแบบเวลาสแกนไม่ถูกต้อง')
];

// Validation rules สำหรับ Authentication
exports.validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('กรุณาระบุชื่อผู้ใช้')
        .isLength({ min: 3, max: 50 })
        .withMessage('ชื่อผู้ใช้ต้องมีความยาว 3-50 ตัวอักษร')
        .trim()
        .escape(),
    
    body('password')
        .notEmpty()
        .withMessage('กรุณาระบุรหัสผ่าน')
        .isLength({ min: 6 })
        .withMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร')
];

// Validation สำหรับ New Feature
exports.validateNewFeature = [
    body('inputField')
        .notEmpty()
        .withMessage('กรุณาระบุข้อมูล')
        .isLength({ min: 1, max: 255 })
        .withMessage('ข้อมูลต้องมีความยาว 1-255 ตัวอักษร')
        .trim()
        .escape()
];
