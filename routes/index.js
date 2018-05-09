var express = require('express');
var QRCode = require('qrcode');
var speakeasy = require("speakeasy");

var router = express.Router();
var secret = speakeasy.generateSecret();

// TODO: don't use global variable 
// save it in database 
var user = {
  name: 'Steven Wu',
  loginStatus: 'Sign Out'
};


function generate() {
  var secret = speakeasy.generateSecret();
  // Returns an object with secret.ascii, secret.hex, and secret.base32.
  // Also returns secret.otpauth_url, which we'll use later.
  // Example for storing the secret key somewhere (varies by implementation):
  user.two_factor_temp_secret = secret.base32;
  user.secret = secret;
}
generate();
/* GET home page. */
router.get('/', function (req, res, next) {
  //console.log('user', user);
  QRCode.toDataURL(user.secret.otpauth_url, function (err, data_url) {
    // console.log(data_url);
    user.qr_url = data_url;
    res.render('index', user);
    // Display this data URL to the user in an <img> tag
  });

});
router.post('/', function (req, res, next) {
  var body = req.body
  var verified = speakeasy.totp.verify({
    secret: user.two_factor_temp_secret,
    encoding: 'base32',
    token: body.token
  });  
  if (verified) {
    user.loginStatus = 'Logged in';
  }
  res.render('index', user);
});

module.exports = router;