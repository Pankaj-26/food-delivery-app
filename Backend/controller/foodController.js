import foodModel from '../models/foodModel.js'
import fs from 'fs'

//add food items

const addFood = async (req, res) => {
  const { name, description, category, price } = req.body

  const image_filename = `${req.file.filename}`

  try {
    const food = new foodModel({
      name,
      description,
      category,
      price,
      image: image_filename,
    })
    await food.save()
    res.status(201).json({ success: true, message: 'food added', food })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find()
    res.status(200).json({ success: true, data: foods })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id)

    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) {
        res
          .status(500)
          .json({ success: false, message: 'Internal Server Error' })
      }
    })
    await foodModel.findByIdAndDelete(req.body.id)

    res.status(200).json({ success: true, message: 'food removed' })
  } catch (error) {
    res.status(404).json({ success: false, message: 'Error' })
  }
}




export { addFood, listFood, removeFood }
