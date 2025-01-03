import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
dotenv.config({})

cloudinary.config({
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET,
    cloud_name: process.env.CLOUDNAME

})

export const uploadFile=async(file)=>{

    try {
        const result=await cloudinary.uploader.upload(file,{resource_type:'auto'})
        return result
        
    } catch (error) {
        console.log(error)
        
    }

}
export const distroyFile=async(publicId)=>{
    try {
     const result=  await cloudinary.uploader.destroy(publicId)
     return result
    } catch (error) {
        console.log(error)
        
    }
}

export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId,{resource_type:"video"});
    } catch (error) {
        console.log(error);
        
    }
}


