import { Chat }from '../models/Chat';
import { NewChat, UserMessage } from '../types/user';
export async function addNewChat(data:NewChat){
  const chat = new Chat(data.userId);
  try{
    await chat.addChat(data.email,data.name);
  }catch(err){
    throw new err('Contact Exist')

  }
}
export async function sendMessage(data:UserMessage){
  const chat = new Chat(data.userId);
  await chat.sendMesage(data.chatId,data.message);
}
export async function getAllChats(userId:string){
  const chat = new Chat(userId);
  return chat.getChats();
}