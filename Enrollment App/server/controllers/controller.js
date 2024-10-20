const PensionerModel = require('../models/pensionerSchema')
const VideoModel = require('../models/videoSchema')
const SessionModel = require('../models/sessionSchema')
const UserModel = require('../models/userSchema')

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
    let { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email: email })
        if (user) {
            if (user.password == password) {
                if (user.enable == true) {
                    // const tokenData = {
                    //     email: user.email,
                    //     id: user._id
                    // }
                    // const token = jwt.sign(tokenData, process.env.JWT_SECRETKEY, {
                    //     expiresIn: '1d'
                    // });

                    res.send({ mes: 'Login Successfull', user })
                }
                else {
                    res.send({ mes: 'Temporarily Blocked By Admin' })
                }
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


const addPensioner = async (req, res) => {
    try {
        const pensioner = await PensionerModel.findOne({ cnic: req.body.cnic })
        if (pensioner) {
            res.send({ mes: 'Pensioner Already Registered ' })
        }
        else {
            const pensioner = await PensionerModel(req.body).save()
            if (pensioner) {
                res.send({ mes: 'Pensioner Registered Succesfully' });
            }
        }
    } catch (error) {
        console.log(error);
    }
}
const addOperator = async (req, res) => {
    try {
        const user = await UserModel.findOne({ cnic: req.body.cnic })
        if (user) {
            res.send({ mes: 'Operator Already Registered ' })
        }
        else {
            const user = await UserModel(req.body).save()
            if (user) {
                res.send({ mes: 'Operator Registered Succesfully' });
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const getOperators = async (req, res) => {
    try {
        const operators = await UserModel.find({ role: 'operator' });
        if (operators) {
            res.send(operators);
        }
        else {
            console.log('Error while fetching operators');
        }
    } catch (err) {
        console.log(err);
    }
}
const getPensioners = async (req, res) => {
    try {
        const pensioners = await PensionerModel.find();
        if (pensioners) {
            res.send(pensioners);
        }
        else {
            console.log('Error while fetching pensioners');
        }
    } catch (err) {
        console.log(err);
    }
}

const getAccountInfo = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.params.id });
        if (user) {
            res.send(user);
        }
        else {
            console.log('Error while getting Info of User');
        }
    } catch (err) {
        console.log(err);
    }
}

const updateOperator = async (req, res) => {
    try {
        // console.log(req.body);
        // console.log(req.params.id);
        const user = await UserModel.updateOne({ _id: req.body._id }, req.body)
        if (user) {
            // console.log(user);
            res.send({ message: "Account Updated Successfully" })
        }
        else {
            res.send({ message: "Account Not Updated" });
        }
    } catch (err) {
        console.log(err);
    }
}

const updatePensioner = async (req, res) => {
    try {
        // console.log(req.body);
        // console.log(req.params.id);
        const pensioner = await PensionerModel.updateOne({ _id: req.body._id }, req.body)
        if (pensioner) {
            // console.log(user);
            res.send({ message: "Account Updated Successfully" })
        }
        else {
            res.send({ message: "Account Not Updated" });
        }
    } catch (err) {
        console.log(err);
    }
}

const enableDisablePensioner = async (req, res) => {
    const updated = !req.body.enable
    try {
        const pensioner = await PensionerModel.updateOne({ _id: req.body._id }, { enable: updated })
        if (pensioner) {
            // console.log(user);
            res.send({ message: "Successfull" })
        }
        else {
            res.send({ message: "Not Successfull" });
        }
    } catch (err) {
        console.log(err);
    }
}
const enableDisableOperator = async (req, res) => {
    const updated = !req.body.enable
    try {
        const user = await UserModel.updateOne({ _id: req.body._id }, { enable: updated })
        if (user) {
            // console.log(user);
            res.send({ message: "Successfull" })
        }
        else {
            res.send({ message: "Not Successfull" });
        }
    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    connection, isLoggedIn, login, addPensioner, addOperator, upload, getOperators, getPensioners, getAccountInfo, updateOperator,
    updatePensioner, enableDisablePensioner, enableDisableOperator
}