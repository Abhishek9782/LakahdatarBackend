const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken"); // we can genarete by using this token for knowing that it is user or not
const bcrypt = require("bcrypt");

exports.userLogin = async (req, res) => {
  const user = req.body.user;
  const cart = req.body.cart;
  try {
    const findUser = await User.findOne({ email: user.email });
    if (findUser !== null) {
      const ispassMatch = await bcrypt.compare(
        user.password,
        findUser.password
      );
      if (ispassMatch) {
        //  Here is use this concept for we can not share our password again on portal so i destructuring here from our user
        const token = jwt.sign(
          { id: findUser._id },
          process.env.JWT_Secret_KEY
        );
        if (cart !== null) {
          findUser.carts = [...cart];
          await findUser.save();
        }
        const { password, ...otherDetails } = findUser._doc;
        res
          .cookie("userAuthentication", token, {
            httpOnly: true,
          })
          .status(200)
          .json({ ...otherDetails });
      } else {
        res.status(300).json({ message: "Password Not Match " });
      }
    } else {
      res.status(500).json({ message: "User Not Found " });
    }
    // const findUser = await User.find({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userRegister = async (req, res) => {
  try {
    const password = req.body.password;

    const isMatch = await User.find({ email: req.body.email });

    if (!isMatch) {
      // Hash Format For secure Our password
      const hashpassword = await bcrypt.hash(password, 10);
      const createUser = await User.create({
        ...req.body,
        password: hashpassword,
      });
      res.status(201).json(createUser);
    } else {
      res
        .status(301)
        .json({ message: "User Already Register With This mail id" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Here we add to cart in user what he want to add his cart this can store in users database

exports.addcartinUser = async (req, res) => {
  const userId = req.params.id;
  const data = req.body;

  try {
    const userfind = await User.findOne({ _id: userId });
    const newArraycartId = userfind.carts.map((carts) => {
      return carts._id;
    });
    if (newArraycartId.includes(data._id)) {
      const updateCarts = userfind.carts.map((cart) => {
        if (cart._id === data._id) {
          cart.qty += 1;
        }
        return cart;
      });
      await User.updateOne({ _id: userId }, { $set: { carts: updateCarts } });
    } else {
      await User.updateOne({ _id: userId }, { $push: { carts: data } });
    }
    res.status(201).json({ Message: "Cart Add Successfully..." });
  } catch (error) {
    res.status(500).json(error);
  }
};

//  If user Logout then he should his cards that's why we are runing it
exports.UserLogout = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  try {
    const findedUser = await User.findOne({ _id: userId });
    findedUser.carts = [];
    await findedUser.save();
    // console.log(findedUser);
    res.status(200).json({ message: "Cart Clear SuccessFully...." });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.usersCarts = async (req, res) => {
  const userId = req.params.id;
  try {
    const cartsFind = await User.findOne({ _id: userId });
    const carts = cartsFind.carts;
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
};

//  Handler decrease Cartvalue
exports.userdeacreasecart = async (req, res) => {
  const cartId = req.params.id;
  const user_id = req.body.userId;
  try {
    const findUser = await User.findOne({ _id: user_id });
    const userCarts = findUser.carts;
    const filtercarts = userCarts.filter((cart) => {
      if (cart.qty > 1) {
        if (cart._id === cartId) {
          cart.qty -= 1;
        }
        return cart;
      } else {
        if (cart._id === cartId && cart.qty == 1) {
          return cart._id !== cartId;
        }
      }
      return cart;
    });
    // Here i update that value from database
    const updatedcarts = await User.updateOne(
      { _id: user_id },
      { $set: { carts: filtercarts } }
    );
    res.status(200).json(updatedcarts);
  } catch (error) {
    res.status(500).json(error);
  }
};

//  Here we increament users cartvalue
exports.userIncrementcart = async (req, res) => {
  const cartId = req.params.id;
  const user_id = req.body.userId;
  try {
    const findUser = await User.findOne({ _id: user_id });
    const userCarts = findUser.carts;
    const filtercarts = userCarts.filter((cart) => {
      if (cart._id === cartId) {
        cart.qty += 1;
      }
      return cart;
    });
    // Here i update that value from database
    const updatedcarts = await User.updateOne(
      { _id: user_id },
      { $set: { carts: filtercarts } }
    );
    res.status(200).json(updatedcarts);
  } catch (error) {
    res.status(500).json(error);
  }
};
