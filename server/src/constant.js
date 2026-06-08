const DB_NAME = 'Yumverse';
const OPTION = {
        httpOnly: true,
        secure: true
    }
const USER_SAFE_FIELDS = "-password -refreshToken -forgotPasswordToken -forgotPasswordExpiry";
const MALE_AVATAR = "https://res.cloudinary.com/recipe-web/image/upload/v1779023895/yumvers_male_l5rruz.png";
const FEMALE_AVATAR = "https://res.cloudinary.com/recipe-web/image/upload/v1779023895/yumvers_female_paczd5.png";

module.exports = { DB_NAME, OPTION, USER_SAFE_FIELDS, MALE_AVATAR, FEMALE_AVATAR };