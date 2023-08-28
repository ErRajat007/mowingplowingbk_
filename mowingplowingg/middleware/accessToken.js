const jwt     = require('jsonwebtoken');
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
     
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, 'aabbcc', (err, user) => {
            if (err) {
                return res.json({'status':false,message:"Unauthorize"});
            }

            req.user = user;
            next();
        });
    } else {
        // res.sendStatus(401);
        return res.json({'status':false,message:"Unauthorize"});
    }
};


module.exports = authenticateJWT;