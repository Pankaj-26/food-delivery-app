import orderModel from "../models/orderModel.js";  
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from 'dotenv'

dotenv.config()


const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);

const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

//placing user order from frontend

const placeOrder=async(req,res)=>{
  
    try{
        const {userId, items, amount, address}=req.body;
      
        const newOrder= new orderModel({
            userId,
            items,
            amount,
            address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId,{cartData:{}});
        const line_items=req.body.items.map((item)=>({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price*100,
            },
            quantity: item.quantity,
        }))

        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: "Delivery Charge",
                },
                unit_amount: 2*100*80,
            },
            quantity: 1,
        })



const session = await stripe.checkout.sessions.create({
    line_items:line_items,
    mode: "payment",
    success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    line_items: line_items, 
});


        res.status(200).send({success:true, session_url:session.url ,message:"Order Placed Successfully"});
    }catch(error){
         res.status(400).send({message:error.message});
    }

}


const verifyOrder=async(req ,res)=>{
    try{
        const {success, orderId}=req.body;
        if(success==="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:"true"});
            res.json({success:true,message:"Payment Successfull"});
        }else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Payment Failed"});
        }
      
    }catch(error){
        
        res.status(400).send({message:error.message});
    }
}


const userOrders=async(req ,res)=>{
    try{
        const orders=await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders});
    }catch(error){
        
        res.status(400).send({message:error.message});
    }
}


//listing orders for admin panel

const listOrders=async(req,res)=>{

    try{
        const orders=await orderModel.find({})
        res.json({success:true,data:orders});

    }catch(e){
        res.json({success:false,message:"Error"})

    }

}


//status update for order status 

const updateStatus=async(req,res)=>{

    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})

        res.json({success:true,message:"Order status updated"})


    }catch(e){

        res.json({})
    }

}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}