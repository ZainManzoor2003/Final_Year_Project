var jwt = require('jsonwebtoken');
const PensionerModel = require('../models/pensionerSchema')
const VideoModel = require('../models/videoSchema')
const SessionModel = require('../models/sessionSchema')
const UserSchema = require('../models/userSchema')

const connection = (req, res) => {
    res.send('Hello')
}

const isLoggedIn = (req, res, next) => {
    if (!token) {
        res.send({ mes: 'Token Missing' })
    }
    else {
        jwt.verify(token, process.env.JWT_SECRETKEY, (err, decoded) => {
            if (err) {
                res.send({ mes: 'Error with token' })
            }
            else {
                next();
                // console.log(decoded);
            }
        })
    }
}
const login = async (req, res) => {
    let { cnic, password } = req.body
    try {
        const user = await PensionerModel.findOne({ cnic: cnic })
        if (user) {
            if (user.password == password) {
                const tokenData = {
                    email: user.cnic,
                    id: user._id
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRETKEY, {
                    expiresIn: '1d'
                });
                res.send({ mes: 'Login Successfully', token, user })
            }
            else {
                res.send({ mes: 'Wrong Password' })

            }
        }
        else {
            res.send({ mes: 'Account Not Exists' });
        }
    } catch (error) {
        console.log(error);
    }
}

const upload = async (req, res) => {
    try {
        const file = req.file;
        let { cnic } = req.body;
        if (!file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }
        else {
            const user = await PensionerModel.findOne({ cnic: cnic });
            const baseName = file.originalname.split('.')[0]
            const parts = baseName.split('_');
            const videoPath = parts[0] + '/' + parts[2] + '/' + file.filename
            const video = await VideoModel({ videoPath }).save();
            if (video) {
                user.videos.push(video._id)
                await user.save()
                res.status(200).send({ message: 'File uploaded successfully', file: file, filename: file.filename });
            }
        }
    } catch (error) {
        res.status(500).send({ message: 'File upload failed', error: error.message });
    }
}

const incrementSessions = async (req, res) => {

    const cnic = req.body.cnic
    const totalSessions = req.body.totalSessions

    try {
        // await PensionerModel.updateOne({ cnic: cnic }, { totalSessions: totalSessions + 1 });
        const session = await SessionModel({ session: totalSessions + 1, time: new Date() }).save()
        const user = await PensionerModel.findOne({ cnic });
        user.sessions.push(session._id);
        await user.save()
        res.status(200).send({ totalSessions: user.sessions.length });

    } catch (error) {
        console.log(error.message);
    }
}

const register = async (req, res) => {
    let { name, cnic, password, totalSessions } = req.body
    try {
        const user = await PensionerModel.findOne({ cnic: cnic })
        if (user) {
            res.send({ mes: 'User Already Registered ' })
        }
        else {
            const user = await PensionerModel({ name, cnic, password, totalSessions }).save()
            if (user) {
                res.send({ mes: 'Account Registered Succesfully' });
            }
        }
    } catch (error) {
        console.log(error);
    }
}



module.exports = { connection, isLoggedIn, login, register, upload, incrementSessions }