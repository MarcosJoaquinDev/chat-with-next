import { contactExistError, createAuthError } from "./Error";
import { DATA_BASE, RTDB } from "./firebase"
import { v4 as uuidv4 } from 'uuid';
import { NewChat } from "../types/user";

const USER_COLLECTION = DATA_BASE.collection('User')
const CHAT_COLLECTION = DATA_BASE.collection('Chat')
const FIRST_DOC = 0;

export class Chat {
  userId :string;
  data:any;
  constructor(userId:string){
    this.userId = userId;
  }
  private async searchEmailInUsers(email:string){
    const userExist = await USER_COLLECTION.where("email","==",email).get();
    return {
      doc:userExist.docs[FIRST_DOC],
      userEmpty:userExist.empty
    }
  }
  private async getData(){
    const user_doc = await USER_COLLECTION.doc(this.userId);
    const user_data = await user_doc.get();
    this.data = user_data.data();
  }
  private async setChat(){
    const user_doc = await USER_COLLECTION.doc(this.userId);
    await user_doc.set(this.data);
  }
  private async createRoom(roomId:string,data:NewChat){
    let newChat = { roomId, email:data.email,name:data.name,img:data.img }
    this.data.chats.push(newChat);
    await this.setChat();
  }
  private async verifyMyContacts(email:string){
    await this.getData();
    const contacts = this.data.chats as any;
    const result =  contacts.find( i => i.email === email)
    return result;
  }
  async addChat(email:string,name:string){
    const {userEmpty,doc} = await  this.searchEmailInUsers(email);
    if(userEmpty){
      throw createAuthError('');
    }

    if(!userEmpty && !(await this.verifyMyContacts(email))){
      let roomId = await this.createNewRoom();
      const newUser = doc.data();
      const data = {email:this.data.email,roomId,name:this.data.username,img:this.data.img};
      newUser.chats.push(data);
      const user_doc = await USER_COLLECTION.doc(doc.id);
      await user_doc.set(newUser);
      const img = newUser.img;
      await this.createRoom(roomId,{email,name,img});
    }else{
      throw contactExistError('')
    }
 }
  private async createNewRoom():Promise<string>{
    let roomId = uuidv4();
    const res = await CHAT_COLLECTION.add({roomId});
    const roomRef = RTDB.ref('rooms/' + roomId);
    await  roomRef.set({ messages: [''] })
    return res.id
  }
  async sendMesage(chatId:string,message:string){
    await this.getData();
    const from = this.data.email;
    const roomRef = RTDB.ref('rooms/' + chatId + '/messages/' );
    await roomRef.push({from,message});
  }
  async getChats(){
    await this.getData();
    return this.data.chats;
  }
  async getOneChat(chatId:string){
    return await (await CHAT_COLLECTION.doc(chatId).get()).data();
  }
}