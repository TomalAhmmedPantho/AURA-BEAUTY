import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
    }
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true }, // e.g., Dhaka
    phone: { type: String, required: true }, // Important for COD delivery
    postalCode: { type: String },
    country: { type: String, default: 'Bangladesh' }
  },
  shippingLocation: { 
    type: String, 
    enum: ['inside', 'outside'], 
    required: true 
  },
  shippingPrice: { 
    type: Number, 
    required: true, 
    default: 0.0 
  },
  totalPrice: { 
    type: Number, 
    required: true, 
    default: 0.0 
  },
  paymentMethod: { 
    type: String, 
    required: true, 
    default: 'Cash on Delivery' 
  },
  isPaid: { 
    type: Boolean, 
    required: true, 
    default: false 
  },
  paidAt: { 
    type: Date 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);