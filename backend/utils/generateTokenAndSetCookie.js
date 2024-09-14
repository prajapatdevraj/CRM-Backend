const jwt =require("jsonwebtoken");
module.exports.generateTokenAndSetCookie=(id,res)=>{
    const token=jwt.sign(id,process.env.JWT_SECRET);
    res.cookie("jwt",token);
    console.log('cookie is seted token :>> ', token);
};