import { contactExistError, createAuthError } from "./Error";
import { DATA_BASE, RTDB } from "./firebase"
import { v4 as uuidv4 } from 'uuid';

const USER_COLLECTION = DATA_BASE.collection('User')
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
  private async getChats(){
    const user_doc = await USER_COLLECTION.doc(this.userId);
    const user_data = await user_doc.get();
    this.data = user_data.data();
  }
  private async setChat(){
    const user_doc = await USER_COLLECTION.doc(this.userId);
    await user_doc.set(this.data);
  }
  private async createRoom(roomId:string,email:string){
    this.data.chats.push(roomId);
    this.data.contacts.push(email);
    await this.setChat();
    const roomRef = RTDB.ref('rooms/' + roomId);
    await  roomRef.set({ messages: [''] })
  }
  private async verifyMyContacts(email:string){
    await this.getChats();
    const contacts = this.data.contacts as any;
    const result =  contacts.find( i => i === email)
    return result;

  }
  async addChat(email:string){
    const {userEmpty,doc} = await  this.searchEmailInUsers(email);
    if(userEmpty){
      throw createAuthError('');
    }

    if(!userEmpty && !(await this.verifyMyContacts(email))){
      let roomId = uuidv4()
      const dataOfNewUser = doc.data();
      dataOfNewUser.chats.push(roomId);
      dataOfNewUser.contacts.push(this.data.email);
      const user_doc = await USER_COLLECTION.doc(doc.id);
      await user_doc.set(dataOfNewUser);
      await this.createRoom(roomId,email);
    }else{
      throw contactExistError('')
    }
 }
 async sendMesage(chatId:string,message:string){
  await this.getChats();
  const from = this.data.email;
  const roomRef = RTDB.ref('rooms/' + chatId + '/messages/' );
  await roomRef.push({from,message});
 }
}