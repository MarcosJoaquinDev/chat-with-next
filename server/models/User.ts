import {DATA_BASE } from './firebase';
import * as crypto from 'crypto';
import { createAuthError, createPasswordError }from './Error'
import { UserInitial, UserLogin } from '../types/user';

const USER_COLLECTION = DATA_BASE.collection('User')
const AUTH_COLLECTION = DATA_BASE.collection('Auth')
const FIRST_DOC = 0;

export class User{

  async getData(userID:string){
    const documentRef =  await USER_COLLECTION.doc(userID)
    const res = await documentRef.get();
    return res.data();
  }

  private codeGenerate(password:string):string{
    return crypto.createHash('sha256').update(password).digest('hex');
  }
  private async searchEmailInUsers(email:string){
    const userExist = await AUTH_COLLECTION.where("email","==",email).get();
    return {
      doc:userExist.docs[FIRST_DOC],
      userEmpty:userExist.empty
    }
  }
  async setAuthentication(data:UserInitial){

    const {userEmpty} = await this.searchEmailInUsers(data.email);
    if(userEmpty){
      const passwordToken = this.codeGenerate(data.password);
      const newUser = await USER_COLLECTION.add({email:data.email,username:data.username,img:data.img,chats:[]});
      await AUTH_COLLECTION.add({email:data.email,password:passwordToken,userID:newUser.id});
      return `${data.email} create succesfull!`
    }else{
      throw createAuthError('');
    }

  }
  async setAuthorizarion(data:UserLogin){
    const {userEmpty , doc} = await this.searchEmailInUsers(data.email);
    let validet ;

    if(!userEmpty){
      const passwordToken = this.codeGenerate(data.password);
      const encryptedPassword = doc.get('password');
      validet = passwordToken === encryptedPassword;
    }else{
      throw createAuthError('');
    }
    if(validet){
      return doc.get('userID');
    }else{
      throw createPasswordError('');
    }
  }
  static async verifyCode(email){
    const res = await USER_COLLECTION.where("email","==",email).get();
    return res.docs[0].data();
  }

  deleteChat(){

  }
  sendMessage(){

  }
}