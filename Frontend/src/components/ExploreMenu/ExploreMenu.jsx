import React from 'react'
import "./ExploreMenu.css"
import { menu_list } from '../../assets/assets'


const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className='expolre-menu' id='explore-menu'>
        <h1>Explore our menu</h1>
        <p className='explore-menu-text'>Embark on a delightful journey through a world of flavors with Tomato. Our meticulously crafted meals are designed to bring joy and excitement to your dining experience. Each dish is a masterpiece, created with passion, precision, and the finest ingredients to tantalize your taste buds. </p>
<div className="explore-menu-list">
    {menu_list.map((item,index)=>{
        return(
            <div onClick={()=>setCategory(prev=>prev==item.menu_name?"All":item.menu_name)} key={index} className="explore-menu-list-item">
                <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                <p>{item.menu_name}</p>
            </div>
        )
    })}
</div>
<hr />
    </div>
  )
}

export default ExploreMenu