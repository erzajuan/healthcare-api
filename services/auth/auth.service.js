const { User } = require("../../models");
const { generateToken, generateRefreshToken } = require("../../helpers/auth");
const bcrypt = require("bcrypt");

const registerUser = async (name, email, password) => {
  try {
    const checkEmail = await User.find({ email });

    if (checkEmail.length > 0) {
      return { success: false, message: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );

    const newUser = await User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const loginUser = async (email, password) => {
  try {
    const checkEmail = await User.find({ email });

    if (checkEmail.length === 0) {
      return { success: false, type: "UNAUTHORIZED", message: "Invalid email" };
    }

    const isPasswordValid = bcrypt.compareSync(
      password,
      checkEmail[0].password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        type: "UNAUTHORIZED",
        message: "Invalid password",
      };
    }

    const access_token = generateToken(checkEmail.data);
    const refreshToken = generateRefreshToken(
      checkEmail[0]._id,
      checkEmail[0].role
    );

    return {
      success: true,
      data: {
        access_token: access_token,
        refreshToken: refreshToken,
        role: checkEmail[0].role,
      },
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  registerUser,
  loginUser,
};
