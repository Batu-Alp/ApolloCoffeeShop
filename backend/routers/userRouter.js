import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel';
import { generateToken, isAuth } from '../utils';

const userRouter = express.Router();

userRouter.get(
  '/createadmin',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = new User({
        name: 'admin',
        email: 'admin@example.com',
        password: 'jsamazona',
        isAdmin: true,
        isSeller : false,
      });
      const createdUser = await user.save();
      res.send(createdUser);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  })
);

userRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
   
    const user2 = await User.findById(req.params.id);

    res.send(user2);
  })
);
userRouter.get(
  '/createseller',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = new User({
        name: 'seller1',
        email: 'seller@example.com',
        password: 'sell',
        isAdmin: false,
        isSeller : true,
      });
      const createdUser = await user.save();
      res.send(createdUser);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  })
);
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const signinUser = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!signinUser) {
      res.status(401).send({
        message: 'Invalid Email or Password',
      });
    } else {
      res.send({
        _id: signinUser._id,
        name: signinUser.name,
        email: signinUser.email,
        isAdmin: signinUser.isAdmin,
        isSeller: signinUser.isSeller,
        cash : signinUser.cash, // yeni ekledim
        token: generateToken(signinUser),
      });
    }
  })
);
userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      cash : req.body.cash,
    });
    const createdUser = await user.save();
    if (!createdUser) {
      res.status(401).send({
        message: 'Invalid User Data',
      });
    } else {
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        isSeller: createdUser.isSeller,
        cash : createdUser.cash, // yeni ekledim
        token: generateToken(createdUser),
      });
    }
  })
);
/*
userRouter.post(
  '/customer-messages',
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      comment: req.body.comment,
    });
    const createdUser = await user.save();
    if (!createdUser) {
      res.status(401).send({
        message: 'Invalid User Data',
      });
    } else {
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
      });
    }
  })
);

*/
userRouter.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send({
        message: 'User Not Found',
      });
    } else {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      user.cash = req.body.cash || user.cash;
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: updatedUser.isSeller,
        cash : updatedUser.cash, // yeni ekledim
        token: generateToken(updatedUser),
      });
    }
  })
);

userRouter.put(
  '/cash/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send({
        message: 'User Not Found',
      });
    } else {
      user.cash -= req.body.totalCost;
      // const updatedUser = await user.save();
      /*
      res.send({
        cash : updatedUser.cash, // yeni ekledim
        token: generateToken(updatedUser),
      });
      */
    }
  })
);

export default userRouter;
