const User = require("../models/user");
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
exports.google = async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;

    const existingUser = await User.findOne({ email });

    let avatarData;

    if (avatar) {
  
      await cloudinary.v2.uploader.upload(
        avatar,
        {
          folder: "profiles",
          width: 200,
          crop: "scale",
        },
        (err, result) => {
          if (err) {
            console.error("Error uploading avatar to Cloudinary:", err);
            throw err;
          }
          avatarData = {
            public_id: result.public_id,
            url: result.url,
          };
        }
      );
    }

    if (existingUser) {

      sendToken(existingUser, 200, res);
    } else {

      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        avatar: avatarData,
      });

      await newUser.save();

      sendToken(newUser, 201, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.facebook = async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;

    const existingUser = await User.findOne({ email });

    let avatarData;

    if (avatar) {

      await cloudinary.v2.uploader.upload(
        avatar,
        {
          folder: "profiles",
          width: 200,
          crop: "scale",
        },
        (err, result) => {
          if (err) {
            console.error("Error uploading avatar to Cloudinary:", err);
            throw err;
          }
          avatarData = {
            public_id: result.public_id,
            url: result.url,
          };
        }
      );
    }

    if (existingUser) {

      sendToken(existingUser, 200, res);
    } else {

      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        avatar: avatarData,
      });

      await newUser.save();


      sendToken(newUser, 201, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.registerUser = async (req, res, next) => {
  const result = await cloudinary.v2.uploader.upload(
    req.body.avatar,
    {
      folder: "profiles",
      width: 200,
      crop: "scale",
    },
    (err, res) => {
      console.log(err, res);
    }
  );

  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.url,
    },
  });

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "Failed to create an account",
    });
  }

  sendToken(user, 200, res);
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({ error: "Please enter email & password" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }

  const isPasswordMatched = await user.comparePassword(password);


  if (!isPasswordMatched) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
 
  sendToken(user, 200, res);
};

exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(req.body.email);
  if (!user) {
    return res.status(404).json({ error: "User not found with this email" });

  }
 
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });


  const resetUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;
  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Myrmidons Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ error: error.message });
  
  }
};

exports.resetPassword = async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Password reset token is invalid or has been expired" });
   
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({ message: "Password does not match" });
    
  }


  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
};

exports.getUserProfile = async (req, res, next) => {

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
};

exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("password");
  
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }
  user.password = req.body.password;
  await user.save();
  sendToken(user, 200, res);
};

exports.updateProfile = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
    if (req.body.avatar !== "") {
      const user = await User.findById(req.user.id);

      const image_id = user.avatar.public_id;
      const res = await cloudinary.v2.uploader.destroy(image_id);

      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "profiles",
        width: 200,
        crop: "scale",
      });

      newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return res.status(401).json({ message: "User Not Updated" });
  }

  res.status(200).json({
    success: true,
  });
};

exports.allUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
};

exports.getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res
      .status(400)
      .json({ message: `User does not found with id: ${req.params.id}` });
    
  }

  res.status(200).json({
    success: true,
    user,
  });
};

exports.deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res
      .status(401)
      .json({ message: `User is not found with id: ${req.params.id}` });
    
  }

  
  const image_id = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(image_id);
  await User.findByIdAndRemove(req.params.id);
  return res.status(200).json({
    success: true,
  });
};

exports.updateUser = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    
  });

  return res.status(200).json({
    success: true,
  });
};
