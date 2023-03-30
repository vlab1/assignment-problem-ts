"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LensesSchema = new mongoose_1.Schema({
    manufacturer: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    material: {
        type: String,
        trim: true,
    },
    coating: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    images: {
        type: (Array),
        trim: true,
    },
    name: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        trim: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Lenses', LensesSchema);
