"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const register = joi_1.default.object({
    name: joi_1.default.string().min(3).max(15).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(3).max(15).required(),
    password_confirmation: joi_1.default.any().equal(joi_1.default.ref('password')).required(),
});
const login = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(3).max(15).required(),
});
const delete0 = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24).required(),
});
const find = joi_1.default.object({
    email: joi_1.default.string(),
});
exports.default = { register, login, delete0, find };
