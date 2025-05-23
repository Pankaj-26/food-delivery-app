import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [showLogin,setShowLogin]=useState(false)
const [token,setToken]=useState("")
const [foodList,setFoodList]=useState([])


  const url=import.meta.env.VITE_Backend_URL || "http://localhost:4000" 

  // VITE_Backend_URL
  


  const addToCart = async(itemId) => {
    if (!cartItems[itemId]) {
        
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    const token = localStorage.getItem("token");
    if(token){

      axios.post(url+`/api/cart/add`,{itemId},{headers:{token}})
      
    }
    
  };

  const removeFromCart = async(itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if(token){
      await axios.post(url+`/api/cart/remove`,{itemId},{headers:{token}})
    }
  };


  const getTotalCartAmount=()=>{
    let totalAmount=0;
  
    for(const item in cartItems){
      if(cartItems[item]>0)
        {

          let itemInfo=foodList.find((product)=>product._id===item);
          totalAmount += itemInfo.price*cartItems[item]
        }
    }
    return totalAmount;
  }


  const fetchFoodList=async()=>{
    const response=await axios.get(url+`/api/food/list`)
    const data=await response.data.data
    setFoodList(data)
  }


  const loadCartData=async(token)=>{
    
    const response=await axios.get(url+`/api/cart/get`,{headers:{token}})
    const data=await response.data.cartData
    setCartItems(data)

   


  }

  useEffect(()=>{
  
    fetchFoodList()
async function  loadData(){
  // await fetchFoodList()
  const token=localStorage.getItem("token")
  if(token){

    setToken(token)
    await loadCartData(token)
  }
}
loadData()

  },[])

  const contextValue = {
    foodList,
    addToCart,
    cartItems,
    setCartItems,
    removeFromCart,
    getTotalCartAmount,
    showLogin,
    setShowLogin,
    url,
    token,setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
