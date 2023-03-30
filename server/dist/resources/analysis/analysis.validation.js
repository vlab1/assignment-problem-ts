"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const analysis = joi_1.default.object({
    columns: joi_1.default.array().items(joi_1.default.string()).required(),
    rows: joi_1.default.array().items(joi_1.default.string()).required(),
    data: joi_1.default.array().items(joi_1.default.array().items(joi_1.default.number())).required(),
});
const delete0 = joi_1.default.object({
    columns: joi_1.default.array().items(joi_1.default.string().valid(null, "", '')).required(),
    rows: joi_1.default.array().items(joi_1.default.string().valid(null, "", '')).required(),
    data: joi_1.default.array().items(joi_1.default.array().items(joi_1.default.number().valid(0))).required(),
});
exports.default = {
    analysis,
    delete0
};
