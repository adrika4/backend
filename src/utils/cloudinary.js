import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        //upload the file to cloudinary
        const response =await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
    
        })
        //filehas been uploaded successfully
        console.log("file uploaded to cloudinary successfully", response.url);
        return response;
    } catch(error){
        fs.unlinkSync(localFilePath) //remove the loacally saved temporary file as the upload operation failed
        return null;

    }

}

export {uploadOnCloudinary};