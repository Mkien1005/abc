import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    resource_type: 'image',
    format: 'png',
    public_id: `products/${file.originalname.split('.')[0]}`,
  }),
});

export const upload = multer({ storage });
