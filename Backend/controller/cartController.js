import userModel from "../models/userModel.js"

;
//add Items to userCart

const addToCart=async(req,res)=>{
    try{
        let userData= await userModel.findById(req.body.userId)

        let cartData=await userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        
        await userModel.findByIdAndUpdate(req.body.userId,{cartData})
        res.status(200).json({success:true,message:"Item added to cart"})



    }catch(e){
        
        res.status(500).json({success:false,message:"Internal server error"})
    }

}

const removeFromCart=async(req, res)=>{

try{
    let userData= await userModel.findById(req.body.userId)

let cartData=await userData.cartData;
if(cartData[req.body.itemId]>0){
   
    cartData[req.body.itemId]-=1
}

await userModel.findByIdAndUpdate(req.body.userId,{cartData},{ new: true })
res.status(200).json({success:true,message:"Item removed from cart"})
}catch(e){
    res.status(500).json({success:false,message:"Internal server error"})
}

}




const getCart=async(req, res)=>{
try{
    let userData= await userModel.findById(req.body.userId)
    let cartData=await userData.cartData;

    res.status(200).json({success:true,cartData})

}catch(e){
    res.status(500).json({success:false,message:"Internal server error"})
}
}

export {addToCart,removeFromCart,getCart}


