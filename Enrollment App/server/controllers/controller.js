const PensionerModel = require('../models/pensionerSchema')
const VideoModel = require('../models/videoSchema')
const UserModel = require('../models/userSchema')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const connection = (req, res) => {
    res.send('Hello')
}

const isLoggedIn = (req, res, next) => {

    const token = req.body.token; // Assuming you're storing the token in a cookie

    

    if (!token) {
        return res.status(401).send({ isAuthenticated: false });
    }

    try {
        const decoded = jwt.verify(token, 'app'); // Replace 'app' with your secret

        res.send({ isAuthenticated: true, userId: decoded.id, role: decoded.role });
    } catch (error) {
        res.status(401).send({ isAuthenticated: false });
    }
}
const logout = (req, res) => {
    res.clearCookie('authToken', { path: '/' });    
    res.clearCookie('role', { path: '/' });    
    res.status(200).json({ message: "Logged out successfully!" });
}
const login = async (req, res) => {
    let { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email: email })
        if (user) {
            if (user.password == password) {
                if (user.enable == true) {
                    const tokenData = {
                        role: user.role,
                        id: user._id
                    }
                    const token = jwt.sign(tokenData, 'app', {
                        expiresIn: '1d'
                    });
                    // res.cookie('authToken', token, {
                    //     httpOnly: false, // Helps prevent XSS attacks
                    //     secure: false, // Ensures the cookie is only sent over HTTPS (use false for development)
                    //     sameSite: 'none',
                    //     maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
                    // });
                    // res.cookie('role', user.role, {
                    //     httpOnly: false, // Helps prevent XSS attacks
                    //     secure: false, // Ensures the cookie is only sent over HTTPS (use false for development)
                    //     sameSite: 'none',
                    //     maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
                    // });

                    res.send({ mes: 'Login Successfull', user,token })
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
        let { name, username, number, cnic, email, password, address, enable, pensionBank, city,
            urduName, urduCity, urduPensionBank } = req.body; // Extract email and password from request body
        // cnic = cnic.replace(/\s+/g, '');
        // email = email.replace(/\s+/g, '');
        // password = password.replace(/\s+/g, '');
        // name = name.replace(/\s+/g, '');
        // username = username.replace(/\s+/g, '');
        // number = number.replace(/\s+/g, '');
        // pensionBank = number.replace(/\s+/g, '');
        // city = number.replace(/\s+/g, '');


        const pensioner = await PensionerModel.findOne({ cnic });


        if (pensioner) {
            res.send({ mes: 'Pensioner Already Registered' });
        } else {
            // Save the new pensioner
            const newPensioner = await PensionerModel({
                name, username, number, cnic, email, password, address,
                pensionBank, city, enable, urduName, urduCity, urduPensionBank
            }).save();

            if (newPensioner) {
                // Set up the email transporter
                const transporter = nodemailer.createTransport({
                    service: 'gmail', // Use 'gmail' or specify your SMTP server
                    auth: {
                        user: 'zainmanzoor2003@gmail.com', // Replace with your email
                        pass: 'dkxn wkli ucds ovjl',  // Replace with your email password or app-specific password
                    },
                });

                // Configure email options
                const mailOptions = {
                    from: 'zainmanzoor2003@gmail.com', // Sender address
                    to: email, // Receiver email address
                    subject: 'Pensioner Registration Successful',
                    text: `Dear Pensioner, your registration is successful. Your password is: ${password}`,
                };

                // Send the email
                await transporter.sendMail(mailOptions);

                res.send({ mes: 'Pensioner Registered Successfully and Password Sent' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ mes: 'An error occurred' });
    }
};
const addOperator = async (req, res) => {
    try {
        let { name, username, number, cnic, email, password, address, enable, role } = req.body; // Extract email and password from request body
        // cnic = cnic.replace(/\s+/g, '');
        // email = email.replace(/\s+/g, '');
        // password = password.replace(/\s+/g, '');
        // name = name.replace(/\s+/g, '');
        // username = username.replace(/\s+/g, '');
        // number = number.replace(/\s+/g, '');

        const pensioner = await UserModel.findOne({ cnic });


        if (pensioner) {
            res.send({ mes: 'Operator Already Registered' });
        } else {
            // Save the new pensioner
            const newOperator = await UserModel({ name, username, number, cnic, email, password, address, enable, role }).save();

            if (newOperator) {
                // Set up the email transporter
                const transporter = nodemailer.createTransport({
                    service: 'gmail', // Use 'gmail' or specify your SMTP server
                    auth: {
                        user: 'zainmanzoor2003@gmail.com', // Replace with your email
                        pass: 'dkxn wkli ucds ovjl',  // Replace with your email password or app-specific password
                    },
                });

                // Configure email options
                const mailOptions = {
                    from: 'zainmanzoor2003@gmail.com', // Sender address
                    to: email, // Receiver email address
                    subject: 'Operator Registration Successful',
                    text: `Dear Operator, your registration is successful. Your password is: ${password}`,
                };

                // Send the email
                await transporter.sendMail(mailOptions);

                res.send({ mes: 'Operator Registered Successfully and Email Sent' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ mes: 'An error occurred' });
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
    let { name, username, number, password, address } = req.body;
    // password = password.replace(/\s+/g, '');
    // name = name.replace(/\s+/g, '');
    // username = username.replace(/\s+/g, '');
    // number = number.replace(/\s+/g, '');

    try {
        const user = await UserModel.updateOne({ _id: req.body._id }, { name, username, number, password, address })
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
        let { name, username, number, password, address, pensionBank, city, urduName, urduCity, urduPensionBank } = req.body;
        // password = password.replace(/\s+/g, '');
        // name = name.replace(/\s+/g, '');
        // username = username.replace(/\s+/g, '');
        // number = number.replace(/\s+/g, '');
        // pensionBank = number.replace(/\s+/g, '');
        // city = number.replace(/\s+/g, '');        

        const pensioner = await PensionerModel.updateOne({ _id: req.body._id }, {
            name, username, number, password,
            address, pensionBank, city, urduName, urduCity, urduPensionBank
        })
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
    updatePensioner, enableDisablePensioner, enableDisableOperator, logout
}