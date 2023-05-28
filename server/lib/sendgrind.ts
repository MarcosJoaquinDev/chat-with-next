import * as sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
export default async function sendMessageTo(email:string){
  const msg = {
    to: email, // Change to your recipient
    from: 'marcosjuako@hotmail.com', // Change to your verified sender
    subject: 'Codigo de verificacion',
    text: 'Recuerda que este codigo expirara',
    html: '<strong>___Chat Next__</strong>',
  }
  try{
    const res = await sgMail.send(msg);
    console.log('Email sent')
  }catch(error){
    console.error(error)
  }
}