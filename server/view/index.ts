import * as  express from 'express';
import type {Request, Response} from 'express'
import { createNewUser, getUserData, LoginUser } from '../controllers/user'
import { middelwareVerify } from './middleware';
import { addNewChat, sendMessage, getAllChats, getChat } from '../controllers/chats';
import * as cors from 'cors';
import {cloudinary} from '../lib/cloudinary';

function main(){
  const port = 4000;
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(cors())
  app.use(express.json());
  app.listen(port,()=>{
    console.log('todo ok en el puerto', port);
  })
  // USER

  app.post('/signup',async(req:Request,res:Response)=>{
    const { email, password, img , username } = req.body;

    try{
      const result = await createNewUser({email,password,img,username})
      res.status(201).json(result);
    }catch(err){
      res.status(401).json({[err.name]: err.message});
    }
  })


 app.post('/signin',async (req:Request,res:Response)=>{
  const { email, password } = req.body;
  try{

    const token = await LoginUser({email,password})
    res.status(201).json(token);

  }catch(err){

    if(err.name==='Email Error'){
      res.status(401).json({type:err.name,error: 'This email is already registered'});
    }
    if(err.name==='Password Invalid'){
      res.status(402).json({type:err.name,error: 'This password is invalid'});
    }

    if(err.name != 'Email Error'&& err.name !='Password Invalid'){
      res.status(404).json({[err.name]:err.message})
    }
  }
 })
 app.get('/user',middelwareVerify,async (req:Request,res:Response)=>{
    try {
      const {userId} = req.body._user ;
      const meInfo = await getUserData(userId);
      res.json(meInfo);
    } catch (err) {
      res.json(err);
    }
  })

  app.post('/chat',middelwareVerify,async (req:Request,res:Response)=>{
    try {
      const {userId} = req.body._user ;
      const email = req.body.email;
      const name = req.body.name;
      await addNewChat({userId,email,name});
      res.status(200).json(email+' scheduled contact');
    } catch (err) {
      if(err.name==='Email Error'){
        res.status(401).json({message: 'This email is not exist'});
      }
      if(err.name==='Contact Exist'){
        res.status(401).json({message: 'Existing user in your contacts'});
      }
      if(err.name != 'Email Error'&& err.name !='Contact Exist'){
        res.status(404).json({message:err.message})
      }
    }
  })
  app.get('/chat',middelwareVerify,async (req:Request,res:Response)=>{
    try {
      const {userId} = req.body._user ;
      const chats = await getAllChats(userId);
      res.status(200).json({chats});
    } catch (err) {
      console.log(err);
    }
  })

  app.get('/chat/:chatId',middelwareVerify,async (req:Request,res:Response)=>{
    try {
      const {userId} = req.body._user ;
      const chat = await getChat(userId,req.params.chatId);
      res.status(200).json(chat);
    } catch (err) {
      console.log(err);
    }
  })

  app.post('/message',middelwareVerify,async (req:Request,res:Response)=>{
    try {
      const {userId} = req.body._user ;
      const {chatId,message} = req.body;
      const data = {userId,chatId,message}
      await sendMessage(data);
      res.status(200).json('send message');
    } catch (err) {
      console.log(err);
    }
  })

  app.post('/test',async (req:Request,res:Response)=>{
    const { email, password, img , username } = req.body;
    res.json({url:true})
  })

}
main();