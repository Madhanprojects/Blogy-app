const {validateToken}=require("../services/authentication");
const secret=process.env.secret;
function Auth(req, res, next) {
    const token = req.cookies.token;
    try {
        res.locals.user = token
            ? validateToken(token, secret)
            : null;
    } catch {
        res.locals.user = null;
    }
    next();
};
function Verify(req, res, next) {
    const token = req.cookies.token;
    try {
        res.locals.user = token
            ? validateToken(token, secret
                
            )
            : null;
    } catch {
        res.locals.user = null;
    }
    const user=res.locals.user;
    if(!user){
        return res.redirect("/");
    }
    next();
};

module.exports={Auth,Verify};