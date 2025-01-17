import jwt from 'jsonwebtoken';


const authMiddleware=async(req ,res,next)=>{
    const {token}=req.headers  
    if(!token)
        return res.status(401).json({success:false,message:" authorization denied"})

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.body.userId=decoded.id;
        next()
    }catch(err){
        res.status(401).json({success:false,message:"Token is not valid"})
    }
}

export default authMiddleware