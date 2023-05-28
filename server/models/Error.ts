const createErrorFactory = (name:string) =>(message:string)=>{
  return class CustomizedError extends Error{
    constructor(message){
      super(message)
      this.name = name;
    }
  }
}
export const createAuthError = createErrorFactory('Email Error');
export const createPasswordError = createErrorFactory('Password Invalid');
export const contactExistError = createErrorFactory('Contact Exist');