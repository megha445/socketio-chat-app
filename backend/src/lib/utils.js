const jwt = require('jsonwebtoken');

exports.generateTokens =(userId,res)=> {
    const token=jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } 
    );
    console.log("Generated JWT token:", token);
    res.cookie('jwt', token, {
        maxAge: 3600000, // 1 hour
        secure: process.env.NODE_ENV === 'production',

        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie 
        sameSite: 'Lax' // Helps prevent CSRF attacks
    });  
    return token; 
};