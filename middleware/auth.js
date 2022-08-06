const jwt = require("jsonwebtoken");

//auth
const auth = async( req, res, next) => {
    try {
            const token = req.cookies.jwt;
            const verifyUser = await jwt.verify(token,process.env.TOKEN_KEY);
            console.log(verifyUser);
            const user = ({email: verifyUser.email})
            next();
    } catch (error) {
        res.render("signin")
    }
}

module.exports = auth;