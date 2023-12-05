import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth} from '../utils';
import Product from '../models/productModel';

const productRouter = express.Router();
productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const searchKeyword = req.query.searchKeyword
      ? {
          name: {
            $regex: req.query.searchKeyword,
            $options: 'i',
          },
        }
      : {};
    const products = await Product.find({ ...searchKeyword });
    res.send(products);
  })
);
productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.send(product);
  })
);

productRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin || req.user.isSeller) {
      const product = new Product({
        name: 'sample product',
        type: 'sample category',
        description: 'sample desc',
        image: '/images/product-1.jpg',
      });
      const createdProduct = await product.save();
      if (createdProduct) {
        res.status(201).send({ message: 'Product Created', product: createdProduct });
      } else {
        res.status(500).send({ message: 'Error in creating product' });
      }
    } else {
      res.status(403).send({ message: 'Unauthorized to create product' });
    }
  })
);


productRouter.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
      const productId = req.params.id;
      const product = await Product.findById(productId);
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
          res.status(500).send({ message: 'Error in updating product' });
        }
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
  
  })
);


productRouter.delete(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin || req.user.isSeller) {
      const product = await Product.findById(req.params.id);
      if (product) {
        const deletedProduct = await product.remove();
        res.send({ message: 'Product Deleted', product: deletedProduct });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    } else {
      res.status(403).send({ message: 'Unauthorized to delete product' });
    }
  })
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const review = {
        rating: req.body.rating,
        comment: req.body.comment,
        user: req.user._id,
        name: req.user.name,
      };
      product.reviews.push(review);
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      product.numReviews = product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Comment Created.',
        data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      throw Error('Product does not exist.');
    }
  })
);

export default productRouter;
