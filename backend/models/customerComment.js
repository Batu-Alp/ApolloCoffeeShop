import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const customerMessageSchema = new mongoose.Schema(
  {
    reviews: [messageSchema],
  },
  { timestamps: true }
);
const CustomerMessage = mongoose.model('CustomerMessage', customerMessageSchema);
export default CustomerMessage;
