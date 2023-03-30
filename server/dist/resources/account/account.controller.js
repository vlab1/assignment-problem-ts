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
const account_validation_1 = __importDefault(require("@/resources/account/account.validation"));
const account_service_1 = __importDefault(require("@/resources/account/account.service"));
const authenticated_middleware_1 = __importDefault(require("@/middleware/authenticated.middleware"));
class AccountController {
    constructor() {
        this.path = '/account';
        this.router = (0, express_1.Router)();
        this.AccountService = new account_service_1.default();
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, name } = req.body;
                const token = yield this.AccountService.register(email, password, name);
                res.status(201).json({ data: token });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const token = yield this.AccountService.login(email, password);
                res.status(200).json({ data: token });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.getAccount = (req, res, next) => {
            if (!req.account) {
                return next(new http_exception_1.default(404, 'No logged in account'));
            }
            res.status(200).send({ account: req.account });
        };
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const account = yield this.AccountService.delete(_id);
                res.status(201).json({ data: account });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.find = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const props = req.body;
                const accounts = yield this.AccountService.find(props);
                res.status(200).json({ data: accounts });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        1;
        this.router.post(`${this.path}/register`, (0, validation_middleware_1.default)(account_validation_1.default.register), authenticated_middleware_1.default, this.register);
        this.router.post(`${this.path}/login`, (0, validation_middleware_1.default)(account_validation_1.default.login), this.login);
        this.router.get(`${this.path}`, authenticated_middleware_1.default, this.getAccount);
        this.router.delete(`${this.path}/delete`, (0, validation_middleware_1.default)(account_validation_1.default.delete0), authenticated_middleware_1.default, this.delete);
        this.router.get(`${this.path}/find`, (0, validation_middleware_1.default)(account_validation_1.default.find), authenticated_middleware_1.default, this.find);
    }
}
exports.default = AccountController;
