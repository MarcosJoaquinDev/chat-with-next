import { User } from '../models/User';
import * as jwt from 'jsonwebtoken';

const SECRET_KEY_TOKEN = process.env.JSONWEBTOKEN_KEY_TOKEN;

import type { UserInitial, UserLogin } from '../../server/types/user'
import { cloudinary } from '../lib/cloudinary';

const updateURLCloudinary = async (url:string)=>{
  try {
    const respuesta = await cloudinary.uploader.upload(url, {
      resource_type: 'image',
      discard_original_filename: true,
      width: 1000,
    });
    return respuesta.secure_url;
  } catch (err) {
    return 'Error: cloudynary';
  }
}
export async function createNewUser(user:UserInitial){
  const imgUrl = await updateURLCloudinary(user.img);
  user.img = imgUrl;
  console.log(user);

  try{
    const new_user = new User();
    return await new_user.setAuthentication(user);
  }catch(err){
    throw new err('This email is already registered')
  }
}
export async function LoginUser(user:UserLogin){
  try{
    const new_user = new User();
    const userId = await new_user.setAuthorizarion(user);
    const token = jwt.sign({ userId }, SECRET_KEY_TOKEN);
    return {token}
  }catch(err){
    throw new err('')
  }
}
export async function getUserData(userId:string){

  const user = new User();
  try{
    const data = await user.getData(userId);
    return data;
  }catch(err){
    console.log(err);
  }

}