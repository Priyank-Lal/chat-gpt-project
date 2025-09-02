const express = require("express");
const { authMiddleWare } = require("../middlewares/auth.middleware");
const { logOutController } = require("../controllers/user.controller");

const router = express.Router();

router.get("/", authMiddleWare, (req, res) => {
  return res.status(200).json({
    message: "User fetched successfully",
    user: {
      email: req.user.email,
      fullName: req.user.fullName,
      id: req.user._id,
    },
  });
});

router.post("/logout", authMiddleWare, logOutController);

module.exports = router;
