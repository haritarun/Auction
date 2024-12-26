import bcryptjs from "bcryptjs";
import generateTokenAndCookies from "../utils/generateTokenAndCookies.js";
import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        console.log("userAlreadyExists", userAlreadyExists);

        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        // jwt
        generateTokenAndCookies(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new Error("All fields are required");
        }
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isPassword = await bcryptjs.compare(password, userExists.password);
        if (!isPassword) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        generateTokenAndCookies(res, userExists._id);
        userExists.password = undefined;
        res.status(200).json({ success: true, message: "Logged in successfully", user: userExists });
    } catch (error) {
        console.log("Error loggin in ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            res.status(400).json({ success: false, message: "User does not exist" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
