const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const router = express.Router();

// Signup
router.route("/signup").post(async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const exist = await User.findOne({ email: email });
    if (exist) {
      return response.status(409).json({ error: "Email All Ready Exist" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      await user.save();
      // const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      //   expiresIn: "1d",
      // });

      // transport.sendMail({
      //   to: user.email,
      //   from: process.env.EMAIL,
      //   subject: `Signup Successful`,
      //   html: `
      //   <h1>Welcome, ${user.name} To Dark Store</h1>
      //   <h5>Click on <a href="http://localhost:5000/verify?token=${token}">Link</a> , To Activate Account.</h5>
      //   <p>Doing The Above Step Help US :)</p>
      //   `,
      // });

      response.status(200).json({ message: "User Registered" });
    }
  } catch (error) {
    response.status(500).send({ message: "Server Error" });
  }
});

// Verify Email After Signup
//   router.route("/verify").get(async (request, response) => {
//     try {
//       const token = request.query.token;
//       if (token) {
//         const { id } = jwt.verify(token, process.env.SECRET_KEY);
//         await User.updateOne({ _id: id }, { confirm: true });
//         return response.redirect("http://localhost:3000/signin");
//       } else {
//         return response.status(401).json({ message: "Invalid Token" });
//       }
//     } catch (err) {
//       response.status(500).send({ message: "Server Error" });
//     }
//   });

// Signin
router.route("/signin").post(async (request, response) => {
  try {
    const { email, password } = request.body;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return response.status(401).send({ message: "Invalid credentials" });
    } else if (findUser.password === password) {
      const genToken = jwt.sign({ id: findUser._id }, process.env.SECRET_KEY);

      return response.status(200).send({ user: findUser, token: genToken });
    } else {
      return response.status(401).send({ message: "Invalid credentials" });
    }
  } catch (err) {
    response.status(500).send(err);
  }
});

// Find User
//   router.route("/user/:id").get(async (request, response) => {
//     const id = request.params.id;
//     try {
//       const user = await User.findById(id);
//       response.status(200).send(user);
//     } catch (error) {
//       response.status(500).send({ message: "Server Error" });
//     }
//   });

// Update User
//   router.route("/user/update/:id").patch(async (request, response) => {
//     try {
//       const id = request.params.id;
//       const user = await User.findByIdAndUpdate(id, request.body);
//       response.status(200).send("User Updated");
//     } catch (error) {
//       response.status(500).send({ message: "Server Error" });
//     }
//   });

//Forgot Password Link Creation
//   router.route("/reset").post(async (request, response) => {
//     const { email } = request.body;
//     try {
//       const findUser = await User.findOne({ email: email });
//       if (!findUser) {
//         return response.status(401).json({ message: "Register First" });
//       }
//       const token = jwt.sign({ id: findUser._id }, process.env.SECRET_KEY, {
//         expiresIn: "1d",
//       });
//       findUser.resetToken = token;
//       findUser.expireTime = Date.now() + 3600000;

//       await findUser.save();

//       transport.sendMail({
//         to: findUser.email,
//         from: process.env.EMAIL,
//         subject: `To Reset Password`,
//         html: `
//                     <p>You Requested For Password Reset</p>
//                     <h5>Click on <a href="http://localhost:3000/password_reset/${token}">Link</a> , to RESET Password.</h5>
//                   `,
//       });
//       response.status(200).json({ message: "Email Send." });
//     } catch (error) {
//       response.status(500);
//       response.send(error);
//     }
//   });

//Password Reset
//   router.route("/password-reset").post(async (request, response) => {
//     const { newPassword, sentToken } = request.body;
//     try {
//       const findUser = await User.findOne({
//         resetToken: sentToken,
//         expireTime: { $gt: Date.now() },
//       });
//       if (!findUser) {
//         return response.status(403).json({ message: "Session Expired" });
//       }

//       findUser.password = newPassword;
//       findUser.resetToken = undefined;
//       findUser.expireTime = undefined;

//       await findUser.save();
//       response.status(200).json({ message: "Password Updated" });
//     } catch (error) {
//       response.status(500);
//       response.send(error);
//     }
//   });

// Add movies to favourite List
router.route("/favourite").post(async (request, response) => {
  const { userId, movieId } = request.body;
  try {
    const findUser = await User.findOne({ _id: userId });
    if (!findUser) {
      return response.status(404).json({ message: "User Not Found" });
    } else {
      findUser.movies.push(movieId);
      await findUser.save();
      response.status(200).send({ user: findUser });
    }
  } catch (error) {
    response.status(500).send("Server Error", error);
  }
});

module.exports = router;
