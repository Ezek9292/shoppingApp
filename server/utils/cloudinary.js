import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload a buffer or base64 string to Cloudinary.
 * Accepts either:
 * - buffer: Node Buffer
 * - base64: data URL string or base64 string
 * - path: default to cloudinary.uploader.upload
 */
export const uploadFromBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const uploadFromPath = (path, options = {}) => cloudinary.uploader.upload(path, options);

export default cloudinary;
