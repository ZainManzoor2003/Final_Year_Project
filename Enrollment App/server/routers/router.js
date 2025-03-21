const express = require('express');
const connection = require('../controllers/controller')
const router = express.Router();
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log('File',file);

        // Extract the base name and split it to get CNIC and sessions values
        const baseName = file.originalname.split('.')[0];
        const parts = baseName.split('_');
        const cnic = parts[0];

        // Create the user folder path using the CNIC value
        const userFolder = path.join('uploads/videos', cnic);

        // Check if the CNIC directory exists; if not, create it
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        // Create the sessions folder path within the CNIC folder

        // Final path to save the file
        cb(null, userFolder);
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, bytes) {
            const fn = file.originalname.split('_')[0] + '_' + file.originalname.split('_')[1]
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

router.get('/verify-token', connection.isLoggedIn)


// ********* Post Requests *********
router.post('/login', connection.login)

router.post('/logout', connection.logout);

router.post("/upload", upload.single("video"), (req, res) => {
    try {
        // console.log("File uploaded successfully:", req.file);
        res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
        res.status(500).json({ message: "File upload failed", error });
    }
});


router.post('/addPensioner', connection.addPensioner)

router.post('/addOperator', connection.addOperator)

router.post('/updateOperator', connection.updateOperator)

router.post('/updatePensioner', connection.updatePensioner)

router.post('/enableDisablePensioner', connection.enableDisablePensioner)

router.post('/enableDisableOperator', connection.enableDisableOperator)






module.exports = router;
