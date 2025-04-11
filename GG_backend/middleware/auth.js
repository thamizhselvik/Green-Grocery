const jwt = require('jsonwebtoken');

const auth = async(req, res, callback) => {
    try
    {
        //fetch token from authorization header
        const token = req.header('Authorization');

        //chek whether token is given ?
        if(!token)
            return res.status(400).json({'msg': 'No token given..!!'})

        //fetch only the token without method
        const actualToken = token.split(" ")[1];

        const SECRET_KEY = '47222636';

        //verify whether the token is right of wrong
        const adminObj = jwt.verify(actualToken, SECRET_KEY);

        //pass the username to the api
        req.user = adminObj;

        callback();
    }
    catch(err)
    {
        res.status(400).json({'msg':`Error in api ${err}`});
    }
}

module.exports = auth;