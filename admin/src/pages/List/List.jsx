import React from "react";
import "./List.css";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
const List = ({url}) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
      console.log(response.data.data);
    } else {
      toast.error(response.data.message);
    }
  };


  const removeFood=async(id)=>{
    const response=await axios.post(`${url}/api/food/remove/`,{id:id})
    await fetchList();
    if(response.data.success){
      toast.success(response.data.message)
    }else{
      toast.error(response.data.message)
  }
}

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>Category<b>Price</b><b>Description</b>
          <b>Action</b>
        </div>
        {list.map((item,index)=>{
          return(
            <div key={index} className="list-table-format">
              <img src={`${url}/uploads/`+item.image} alt="itemImage" />
              <p>{item.name}</p>
              <p>{item.category}</p>

              <p>{item.price}</p>

              <p>{item.description}</p>
              <p className="cursor" onClick={()=>removeFood(item._id)}>X</p>



            </div>
          )
        })}
      </div>
    </div>
  );
};

export default List;
