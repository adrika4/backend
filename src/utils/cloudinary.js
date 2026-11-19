import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        // configure here (not at import time) so dotenv has already loaded .env
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        //upload the file to cloudinary
        const response =await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
    
        })
        //filehas been uploaded successfully
        console.log("file uploaded to cloudinary successfully", response.url);
        return response;
    } catch(error){
        console.error("cloudinary upload failed:", error?.message || error);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath) //remove the loacally saved temporary file as the upload operation failed
        return null;

    }

}

export {uploadOnCloudinary};