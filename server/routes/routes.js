import express from "express";
import { User } from "../schemas/schemas.js";
const router = express.Router();

router.get("/auth", function (req, res) {
  req.session.userData ? res.send(req.session.userData) : res.send(false);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      username: username,
      password: password,
    }).lean();
    if (user) {
      // Setting session data upon successful login

      const data = {
        isAuth: true,
        fullName: user.fullName,
      };
      req.session.userData = data;
      req.session.save();
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.error(error);
    res.status(409).json({ message: error.message });
  }
});

export default router;
