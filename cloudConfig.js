const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({

  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,

  cloud_name: 'dovjugvy7',
  api_key: '267293914616543',
  api_secret: 'ty_nPu7eiaSWYr22-bLNMbM7fr0'

});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'WanderLust_DEV',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

module.exports = {
  cloudinary,
  storage,
};
