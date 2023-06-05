const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];  // Split 'bearer' from token and get the token
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        const profileId = decodedToken.profileId;
        if( req.body.profileId && req.body.profileId !== profileId ){
            throw 'Invalid profile';
        } else {
            req.auth = { profileId };
            next();
        };
    } catch {
        res.status(401).json({
            error: new Error('Unauthorized request!')
        })
    }
};