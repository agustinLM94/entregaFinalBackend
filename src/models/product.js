import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },

    desripction:{
        type:String
    },

    price:{
        type:Number,
        required:true

    },
    stock:{
        type:Number,
        required:true

    }
}) 

export default mongoose.model('Product',productSchema)