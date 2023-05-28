import { Chat }from '../models/Chat';
import { UserMessage } from '../types/user';
export async function addNewChat(userID:string,email:string){
  const chat = new Chat(userID);
  try{
    await chat.addChat(email);
  }catch(err){
    throw new err('Contact Exist')

  }
}
export async function sendMessage(data:UserMessage){
  const chat = new Chat(data.userId);
  await chat.sendMesage(data.chatId,data.message);
}