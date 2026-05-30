import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
 const connectCloudinary = async()=>{

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
 console.log("clouinary connected");
 }


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'listings',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif','avif'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  }
});

export const uploadMultiple = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
}).array('images', 10);


export const deleteFromCloudinary = async (imageUrl) => {
  try {
   
    const parts = imageUrl.split('/');
    const filename = parts.pop(); 
    const folder = parts.pop();
    const publicId = `${folder}/${filename.split('.')[0]}`; 
    
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};


export const deleteMultipleFromCloudinary = async (imageUrls) => {
  const deletePromises = imageUrls.map(url => deleteFromCloudinary(url));
  await Promise.all(deletePromises);
};

 export default connectCloudinary