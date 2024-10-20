const express = require('express');
const connection = require('../controllers/controller')
const router = express.Router();
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Extract the base name and split it to get CNIC and sessions values
        const baseName = file.originalname.split('.')[0];
        const parts = baseName.split('_');
        const cnic = parts[0];
        const sessions = parts[2];

        // Create the user folder path using the CNIC value
        const userFolder = path.join('uploads/videos', cnic);

        // Check if the CNIC directory exists; if not, create it
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        // Create the sessions folder path within the CNIC folder
        const sessionsFolder = path.join(userFolder, sessions);

        // Check if the sessions directory exists; if not, create it
        if (!fs.existsSync(sessionsFolder)) {
            fs.mkdirSync(sessionsFolder, { recursive: true });
        }

        // Final path to save the file
        cb(null, sessionsFolder);
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, bytes) {
            const fn = file.originalname.split('_')[0] + '_' + file.originalname.split('_')[1] + path.extname(file.originalname)
            cb(null, fn)
        })
    }
})

const upload = multer({ storage: storage })

// ********* Get Requests *********
router.get('/', connection.connection)

router.get('/getOperators', connection.getOperators)

router.get('/getPensioners', connection.getPensioners)

router.get('/getAccountInfo/:id', connection.getAccountInfo)


// ********* Post Requests *********
router.post('/login', connection.login)

// router.post('/upload', upload.single('video'), connection.upload);


router.post('/addPensioner', connection.addPensioner)

router.post('/addOperator', connection.addOperator)

router.post('/updateOperator', connection.updateOperator)

router.post('/updatePensioner', connection.updatePensioner)

router.post('/enableDisablePensioner', connection.enableDisablePensioner)

router.post('/enableDisableOperator', connection.enableDisableOperator)






module.exports = router;
