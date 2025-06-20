const rateLimit = require('express-rate-limit');

// Create a limiter that allows 100 request per 15 minutes
const limiter = rateLimit({
    windowMs:1*60*1000,
    max:100,
    message:'Too many requests from this IP , Please try again after sometime',
    standardHeaders:true,
    legacyHeaders:false,
});

module.exports = { limiter };