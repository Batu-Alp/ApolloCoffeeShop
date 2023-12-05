import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils';
import CustomerMessage from '../models/customerComment';

const supportRouter = express.Router();


supportRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const orders = await CustomerMessage.find({});
    res.send(orders);
  })
);

supportRouter.get(
    '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await CustomerMessage.findById(req.params.id);
    res.send(product);
  })
);
 

supportRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const product = await CustomerMessage();
    if (product) {
      const review = {
        comment: req.body.comment,
        name: req.body.name,
      };
      product.reviews.push(review);
      
      const createMessage = await product.save();
      res.status(201).send({
        message: 'Comment Created.',
        data: createMessage.reviews[createMessage.reviews.length - 1],
      });
    } else {
      throw Error('Message does not exist.');
    }
  })
);

supportRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await CustomerMessage.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price_small = req.body.price_small;
      product.price_medium = req.body.price_medium;
      product.price_large = req.body.price_large;
      product.image = req.body.image;
      product.type = req.body.type;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updatedProduct = await product.save();
      if (updatedProduct) {
        res.send({ message: 'Product Updated', product: updatedProduct });
      } else {
        res.status(500).send({ message: 'Error in updaing product' });
      }
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);
supportRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await CustomerMessage.findById(req.params.id);
    if (product) {
      const deletedProduct = await product.remove();
      res.send({ message: 'Product Deleted', product: deletedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);
export default supportRouter;
