import joi from "joi";
export const userName = joi.string().alphanum().min(3).max(30).required();
export const email = joi.string().pattern(new RegExp("gmail.com$")).required();
export const password = joi.string().min(6).required();
