import json from "jsonwebtoken";
const generateTokenAndCookies = (res, userId) => {
    const token = json.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return token;
};

export default generateTokenAndCookies;
