const { User, Role } = require("../../models");
const { generateToken, generateRefreshToken } = require("../../helpers/auth");
const bcrypt = require("bcrypt");
const redisClient = require("../../config/redis");
const jwt = require("jsonwebtoken");

const registerUser = async (name, email, password, role) => {
  try {
    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      return { success: false, message: "Email already exists" };
    }

    const checkRole = await Role.findOne({ name: role });

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );

    const newUser = await User({
      name,
      email,
      password: hashedPassword,
      role_id: checkRole._id,
    });

    await newUser.save();

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const loginUser = async (email, password) => {
  try {
    const checkEmail = await User.findOne({ email });

    if (!checkEmail) {
      return { success: false, type: "UNAUTHORIZED", message: "Invalid email" };
    }

    const isPasswordValid = bcrypt.compareSync(password, checkEmail.password);

    if (!isPasswordValid) {
      return {
        success: false,
        type: "UNAUTHORIZED",
        message: "Invalid password",
      };
    }

    const role = await Role.findById(checkEmail.role_id);
    checkEmail.role = role.name;

    const payload = {
      id: checkEmail._id,
      name: checkEmail.name,
      email: checkEmail.email,
      role_id: checkEmail.role_id,
      role: role.name,
      createdAt: checkEmail.createdAt,
      updatedAt: checkEmail.updatedAt,
    };

    const access_token = generateToken(payload);
    const refreshToken = generateRefreshToken(checkEmail._id);

    await redisClient.set(
      `refreshToken:${checkEmail._id}`,
      refreshToken,
      { EX: parseInt(process.env.JWT_REFRESH_EXPIRES_IN) } // 1 day expiration
    );

    return {
      success: true,
      data: {
        access_token: access_token,
        refreshToken: refreshToken,
        role: checkEmail.role,
      },
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const refreshToken = async (refreshToken) => {
  try {
    const currentUser = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    const storedToken = await redisClient.get(`refreshToken:${currentUser.id}`);

    if (!storedToken || storedToken !== refreshToken) {
      return { success: false, error: "Invalid or expired refresh token" };
    }

    const payload = {
      id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      role_id: currentUser.role_id,
      role: currentUser.role,
      createdAt: currentUser.createdAt,
      updatedAt: currentUser.updatedAt,
    };

    const access_token = generateToken(payload);

    return {
      success: true,
      data: {
        access_token: access_token,
        refreshToken: refreshToken,
        role: currentUser.role,
      },
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const logout = async (currentUserId) => {
  try {
    if (!currentUserId) {
      return {
        success: false,
        type: "UNAUTHORIZED",
        message: "User not authenticated",
      };
    }

    const result = await redisClient.del(`refreshToken:${currentUserId}`);

    if (result === 0) {
      return { success: false, message: "Logout failed or already logged out" };
    }

    return { success: true, message: "User logged out successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logout,
};
