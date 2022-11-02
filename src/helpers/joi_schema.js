import joi from "joi";
export const userName = joi.string().alphanum().min(3).max(30).required();
export const email = joi.string().pattern(new RegExp("gmail.com$")).required();
export const password = joi.string().min(6).required();
export const title = joi.string().alphanum().required();
export const price = joi.number().required()
export const available = joi.number().required();
export const category_code = joi.string().alphanum().required();
export const image = joi.string().required();
export const bookid = joi.string().required();
export const bookids = joi.array().required();
