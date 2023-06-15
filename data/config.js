const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dw4kyfvlt',
  api_key: '414839544316694',
  api_secret: 'gVF25NO2Gwq-2H2eUTnTUds5mVY',
  secure: true
});

module.exports = cloudinary;
