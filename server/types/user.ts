export interface UserInitial{
  email:string,
  password:string,
  username:string,
  img:string
}
export interface UserLogin{
  email:string,
  password:string
}
export interface UserMessage{
  userId:string,
  chatId:string,
  message:string,
}
export interface NewChat{
  userId?:string,
  name:string,
  email:string,
  img?:string,
}