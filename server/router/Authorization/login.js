const router = require('express').Router();
const pool = require('../../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../../utils/jwtGenerator');
const validInfo = require('../../middlewares/validInfo');
const authorization = require('../../middlewares/authorization');
require('dotenv').config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.USER_ACCOUNT,
      pass: process.env.PASSWORD,
    },
  });





const validateHuman = async(token) =>{
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    //console.log(secret, token);
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {
        method: 'POST'
    });
    const data = await response.json();
    //console.log(data);
    return data.success;
}

router.post('/login', validInfo, async (req, res) => {
    try{
        // 1. destructure the req.body

        const { email, password} = req.body;
        const reToken = req.body.token;
        const validHuman = await validateHuman(reToken);
        if(!validHuman){
            return res.status(401).json(`Ain't no way you are fooling us, Bruv!`);
        }
        // console.log('ei dhuruuuuu');
        // 2. check if user doesn't exist (if not then we throw error)
        
        console.log('comes to login');
        console.log(email, password);
        const user = await pool.query('SELECT * FROM person WHERE email = $1', [email]);
        
        if(user.rows.length === 0){
            return res.status(401).json('Password or Email is incorrect');
        }
        
        // 3. check if incoming password is the same as database password

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        
        if(!validPassword){
            return res.status(401).json('Password or Email is incorrect');
        }
        // console.log(user.rows);
        // 4. give them the jwt token

        const token = jwtGenerator(user.rows[0].id);
        // console.log(token);
        res.json({
            token : token,
            message: "Login Successful",
            isAdmin: user.staff_status === 'admin' ? true : false,
            isDeliveryMan: user.staff_status === 'delivery_man' ? true : false,
        });

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


router.get('/is-verify', authorization, async (req, res) => {
    try{
        // if it passes authorization than it is valid
        const user = await pool.query('SELECT * FROM person WHERE id = $1', [req.user]);

        res.json({
            verified: true,
        });
        // console.log(req.user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post('/reset-password/initiate', async(req, res) => {
    try{
        const { email, otp } = req.body;
        console.log(email, otp);
        const user = await pool.query('SELECT * FROM person WHERE email = $1', [email]);
        if(user.rows.length === 0){
            return res.status(401).json({message: 'User does not exist'});
        }

        const info = await transporter.sendMail({
            from: process.env.USER_ACCOUNT,
            to: email,
            subject: "Reset Password",
            text: `
                Your OTP is ${otp}. Please use this OTP to reset your password.
            `,
            html: `
            <div style="background-color: #f8f9fa; padding: 20px;">
                <h1>Reset Password</h1>
                <p>Your OTP is ${otp}. Please use this OTP to reset your password.</p>  
            </div>

            `
        });
        
        console.log("Message sent: %s", info.messageId);
        
        res.json({
            message: 'Reset Password',
            success: true
        });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post('/reset-password/confirm', async(req, res) => {
    try{
        const { email, password} = req.body;
        const user = await pool.query('SELECT * FROM person WHERE email = $1', [email]);
        if(user.rows.length === 0){
            return res.status(401).json({message: 'User does not exist'});
        }
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        await pool.query('UPDATE person SET password = $1 WHERE email = $2', [bcryptPassword, email]);

        res.json({
            message: 'Password Reset Successful',
            success: true
        });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post('/change-password', authorization, async(req, res) => {
    try{
        const { oldPassword, newPassword, token } = req.body;
        const validHuman = await validateHuman(token);
        if(!validHuman){
            return res.status(401).json({ message: `Ain't no way you are fooling us, Bruv!`, 
            success: false});
        }
        const user = await pool.query('SELECT * FROM person WHERE id = $1', [req.user]);
        if(user.rows.length === 0){
            return res.status(401).json({message: 'User does not exist'});
        }
        
        const validPassword = await bcrypt.compare(oldPassword, user.rows[0].password);
        if(!validPassword){
            return res.status(401).json({
                message: 'Old Password is incorrect',
                success: false
            });
        }
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE person SET password = $1 WHERE id = $2', [bcryptPassword, req.user]);

        res.json({
            message: 'Password Change Successful',
            success: true
        });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


module.exports = router;