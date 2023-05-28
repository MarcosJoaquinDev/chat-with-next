import { User } from '../models/User';
import * as jwt from 'jsonwebtoken';

const SECRET_KEY_TOKEN = process.env.JSONWEBTOKEN_KEY_TOKEN;

import type { UserInitial, UserLogin } from '../../server/types/user'
export async function createNewUser(user:UserInitial){
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