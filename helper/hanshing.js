import bcript from "bcrypt";
export const passwordHashing= async(password)=>{
    const salt = await bcript.genSalt(10);
    return   await bcript.hash(password,salt);
}



export const compairPassword= async(planpassword,hashpassword)=>{
    const compair = await bcript.compare(planpassword,hashpassword);
    return compair;
}





