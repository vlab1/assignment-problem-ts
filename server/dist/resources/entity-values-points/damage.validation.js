"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const create = joi_1.default.object({
    point_id: joi_1.default.number().required(),
    entity_id: joi_1.default.number().required(),
    C: joi_1.default.number()
});
exports.default = {
    create
};
