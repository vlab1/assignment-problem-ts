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
const account_model_1 = __importDefault(require("@/resources/account/account.model"));
const token_1 = __importDefault(require("@/utils/token"));
class AccountService {
    constructor() {
        this.account = account_model_1.default;
    }
    register(email, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountExists = yield this.account.findOne({ email });
                if (accountExists) {
                    throw new Error('Account already exists');
                }
                const account = yield this.account.create({
                    email,
                    password,
                    name,
                });
                return account;
            }
            catch (error) {
                throw new Error('Unable to create account');
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield this.account.findOne({ email });
                if (!account) {
                    throw new Error('Unable to find account with that email address');
                }
                if (yield account.isValidPassword(password)) {
                    const accesToken = token_1.default.createToken(account);
                    return accesToken;
                }
                else {
                    throw new Error('Wrong credentials given');
                }
            }
            catch (error) {
                throw new Error('Unable to login account');
            }
        });
    }
    delete(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield this.account
                    .findByIdAndDelete(_id)
                    .select(['-password'])
                    .exec();
                if (!account) {
                    throw new Error('Unable to delete account with that data');
                }
                return account;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    find(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accounts = yield this.account
                    .find(props)
                    .select(['-password'])
                    .exec();
                if (!accounts) {
                    throw new Error('Unable to find accounts');
                }
                return accounts;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = AccountService;
