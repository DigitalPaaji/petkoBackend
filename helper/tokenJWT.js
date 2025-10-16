import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

const SECRETKEY= `${process.env.SECRETKEY}`
  export  const createToken= (id)=>{ 

    const token =  JWT.sign({id},SECRETKEY,{expiresIn:"90d"});
    return token;
}

export const verifyToken= (token)=>{
    const id=  JWT.verify(token,SECRETKEY)
    return id.id
}

