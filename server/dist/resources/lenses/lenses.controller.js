"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const validation_middleware_1 = __importDefault(require("@/middleware/validation.middleware"));
const lenses_validation_1 = __importDefault(require("@/resources/lenses/lenses.validation"));
const lenses_service_1 = __importDefault(require("@/resources/lenses/lenses.service"));
const authenticated_middleware_1 = __importDefault(require("@/middleware/authenticated.middleware"));
const multer = require('multer');
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });
class LensesController {
    constructor() {
        this.path = '/lenses';
        this.router = (0, express_1.Router)();
        this.LensesService = new lenses_service_1.default();
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { manufacturer, country, material, coating, description, images, name, type } = req.body;
                const lenses = yield this.LensesService.create(manufacturer, country, material, coating, description, images, name, type);
                res.status(201).json({ data: lenses });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, manufacturer, country, material, coating, description, images, name, type, prevImages } = req.body;
                const lenses = yield this.LensesService.update(_id, manufacturer, country, material, coating, description, images, name, type, prevImages);
                res.status(201).json({ data: lenses });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const lenses = yield this.LensesService.delete(_id);
                res.status(201).json({ data: lenses });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.deleteImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, url } = req.body;
                const lenses = yield this.LensesService.deleteImage(_id, url);
                res.status(201).json({ data: lenses });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.find = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const props = req.body;
                const lenses = yield this.LensesService.find(props);
                res.status(201).json({ data: lenses });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/create`, upload.array('pic'), (0, validation_middleware_1.default)(lenses_validation_1.default.create), 
        //authenticated,
        this.create);
        this.router.put(`${this.path}/update`, upload.array('pic'), (0, validation_middleware_1.default)(lenses_validation_1.default.update), authenticated_middleware_1.default, this.update);
        this.router.delete(`${this.path}/delete`, (0, validation_middleware_1.default)(lenses_validation_1.default.delete0), authenticated_middleware_1.default, this.delete);
        this.router.delete(`${this.path}/image/delete`, (0, validation_middleware_1.default)(lenses_validation_1.default.imageDelete), authenticated_middleware_1.default, this.deleteImage);
        this.router.get(`${this.path}/find`, (0, validation_middleware_1.default)(lenses_validation_1.default.find), this.find);
    }
}
exports.default = LensesController;
