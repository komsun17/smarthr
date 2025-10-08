const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const hipController = require('../controllers/hipController');
const hotelController = require('../controllers/hotelController');
const newFeatureController = require('../controllers/newFeatureController');
const checkAuth = require('../middlewares/checkAuth');
const validationMiddleware = require('../middlewares/validationMiddleware');
const TimemintService = require('../services/timemintService');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

console.log('Mounting web routes');

// หน้าแรก redirect ไปหน้า login
router.get("/", (req, res) => res.redirect("/login"));

router.get("/login", authController.getLogin);
router.post("/login", 
  // เพิ่ม error handler สำหรับ CSRF
  (req, res, next) => {
    if (req.csrfToken) {
      next();
    } else {
      console.error('CSRF token missing');
      next();
    }
  },
  (req, res, next) => {
    // ป้องกัน double submit
    if (req.session.loginInProgress) {
      return res.redirect('/dashboard');
    }
    req.session.loginInProgress = true;
    next();
  }, 
  authController.postLogin, 
  (req, res, next) => {
    // ลบ flag หลังจาก login เสร็จ
    delete req.session.loginInProgress;
    next();
  }
);

router.get("/logout", authController.logout);
router.get("/dashboard", checkAuth, dashboardController.getDashboard);

router.get("/hip-finger-scan", checkAuth, hipController.getHipFingerPage);

router.get("/hotel", checkAuth, hotelController.getHotelPage);
router.post("/hotel", checkAuth, hotelController.postHotelAction);

router.get("/hip-carpark", checkAuth, hipController.getHipCarparkPage);
router.post("/hip-carpark", checkAuth, hipController.postHipCarparkAction);

router.get("/new-feature", checkAuth, newFeatureController.getNewFeaturePage);
router.post("/new-feature", checkAuth, newFeatureController.postNewFeatureAction);

router.get("/import-timemint", checkAuth, (req, res) => {
    res.render("import-timemint", { title: "Import Timemint", result1: [], result2: [] });
});

router.post("/import-timemint", checkAuth, upload.fields([{ name: 'file1' }, { name: 'file2' }]), async (req, res) => {
    const service = new TimemintService('your-api-key');
    try {
        const file1 = req.files['file1'] ? req.files['file1'][0].path : null;
        const file2 = req.files['file2'] ? req.files['file2'][0].path : null;

        let result1 = [], result2 = [];
        if (file1) result1 = await service.importAttendanceFromExcel(file1);
        if (file2) result2 = await service.importAttendanceFromExcel(file2);

        res.render('import-timemint', { 
            title: "Import Results", 
            result1, 
            result2,
            success: 'Import สำเร็จ'
        });
    } catch (error) {
        console.error('Import error:', error);
        res.render('import-timemint', { 
            title: "Import Timemint", 
            result1: [], 
            result2: [],
            error: 'เกิดข้อผิดพลาดในการ import: ' + error.message
        });
    }
});

module.exports = router;

