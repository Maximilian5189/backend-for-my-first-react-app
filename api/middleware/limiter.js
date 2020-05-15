var RateLimiter = require('limiter').RateLimiter;
// Allow 150 requests per hour (the Twitter search limit). Also understands
// 'second', 'minute', 'day', or a number of milliseconds
var limiter = new RateLimiter(150, 'hour');
 
// Throttle requests
module.exports = (req, res, next) => {
  limiter.removeTokens(1, (err, remainingRequests) => {
    console.log('remain: ', remainingRequests)
    next();
  });
}
