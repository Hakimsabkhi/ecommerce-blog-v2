
import cloudinary from 'cloudinary';
import stream from 'stream';
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (folder: string, file: File): Promise<string> => {
  try {
    const fileBuffer = await file.arrayBuffer();
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(fileBuffer));

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder, format: 'webp' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      bufferStream.pipe(uploadStream);
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

export default uploadImage;
