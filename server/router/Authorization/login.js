const router = require('express').Router();
const pool = require('../../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../../utils/jwtGenerator');
const validInfo = require('../../middlewares/validInfo');
const authorization = require('../../middlewares/authorization');


router.post('/login', validInfo, async (req, res) => {
    try{
        // 1. destructure the req.body

        const { email, password } = req.body;
        // console.log('ei dhuruuuuu');
        // 2. check if user doesn't exist (if not then we throw error)
        
        
        const user = await pool.query('SELECT * FROM person WHERE email = $1', [email]);
        if(user.rows.length === 0){
            return res.status(401).json('Password or Email is incorrect');
        }
        
        // 3. check if incoming password is the same as database password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
       
        if(!validPassword){
            return res.status(401).json('Password or Email is incorrect');
        }
        
        // 4. give them the jwt token

        const token = jwtGenerator(user.rows[0].id);
        console.log(token);
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


module.exports = router;