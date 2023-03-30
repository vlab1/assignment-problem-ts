"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const create = joi_1.default.object({
    manufacturer: joi_1.default.string(),
    country: joi_1.default.string(),
    material: joi_1.default.string(),
    coating: joi_1.default.string(),
    description: joi_1.default.string(),
    images: joi_1.default.array(),
    name: joi_1.default.string().required(),
    type: joi_1.default.string().required()
});
const update = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24).required(),
    manufacturer: joi_1.default.string(),
    country: joi_1.default.string(),
    material: joi_1.default.string(),
    coating: joi_1.default.string(),
    description: joi_1.default.string(),
    images: joi_1.default.array(),
    name: joi_1.default.string().required(),
    type: joi_1.default.string(),
    prevImages: joi_1.default.array()
});
const delete0 = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24).required(),
});
const find = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24),
    manufacturer: joi_1.default.string(),
    country: joi_1.default.string(),
    material: joi_1.default.string(),
    coating: joi_1.default.string(),
    description: joi_1.default.string(),
    name: joi_1.default.string(),
    type: joi_1.default.string()
});
const imageDelete = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24).required(),
    url: joi_1.default.string().required(),
});
exports.default = {
    create,
    update,
    delete0,
    find,
    imageDelete
};
