import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  inStock: { type: Boolean, default: true },
  isNewArrival: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);