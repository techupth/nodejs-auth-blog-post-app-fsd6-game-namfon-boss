import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { db } from "../utils/db.js";
import {
  validatePostLogin,
  validatePostRegister,
} from "../middlewares/auth-validate.js";

const authRouter = Router();


authRouter.post("/register", [validatePostRegister], async (req, res) => {
    const userData = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
    try {
      const result = await db.collection("users").insertOne(userData);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server could not connect database" });
    }
    return res.status(201).json({
      message: "User has been created successfully",
    });
  });

authRouter.post("/login", [validatePostLogin], async (req, res) => {
    let user;
    try {
      user = await db
        .collection("users")
        .findOne({ username: req.body.username });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server could not connect database" });
    }
  
    //--- validate username
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }
    //--- validate password
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }
    //--- generate token
    const token = jwt.sign(
      { id: user._id, firstName: user.firstName, lastName: user.lastName },
      process.env.SECRET_KEY,
      { expiresIn: "900000" }
    );
    return res.status(200).json({
      message: "login successfully",
      token: token,
    });
  });

export default authRouter;
