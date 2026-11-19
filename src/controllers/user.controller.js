import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {
     //get info from user model/frontend
     // validation - not empty, correct format etc
     //check if user already exists: email, username
     //check for images, avatar
     //upload to cloudinary
     //create user object: creation call: entry in db
     //remove password and refresh token field from response
     // check for user creation
     //return res


     const {fullName, email, username, password} = req.body 
     console.log("email", email);


     if(
        [fullName, email, username, password].some((field)=>field?.trim()==="")
       ) {
        throw new ApiError(400, "All fields are required")
        }

        const existedUser = await User.findOne({
            $or: [{username}, {email}]
        })
        console.log("existedUser:", existedUser);
        if(existedUser){
            throw new ApiError(409, "user with email/username already exists")
        }

        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

        if(!avatarLocalPath){
            throw new ApiError(400, "Avatar File is required")
        }



       const avatar = await uploadOnCloudinary(avatarLocalPath)
       const coverImage = await uploadOnCloudinary(coverImageLocalPath)

       if (!avatar){
        throw new ApiError(400, "Avatar File is required")
       }

       const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
       })

       const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
       )

       if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")


       }

       return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
       )



        



    //  if ([fullName, email, username, password].some((field) => !field || field.trim() === "")) {
    //       throw new ApiError(400, "fullName, email, username and password are required")
    //  }
    //  console.log("email: ", email)

    //  return res.status(200).json(
    //       new ApiResponse(200, { fullName, email, username }, "Request received")
    //  )

})

export { registerUser }
