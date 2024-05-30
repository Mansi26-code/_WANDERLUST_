const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dovjugvy7',
  api_key: '267293914616543',
  api_secret: 'ty_nPu7eiaSWYr22-bLNMbM7fr0'
});


//This storage is like...google drive pr aapne ek folder bana liya jahan aapko files upload krni h 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
    allowedFormats:["png","jpg","jpeg"],
    },
  });

  module.exports={
    cloudinary,
    storage,
  };