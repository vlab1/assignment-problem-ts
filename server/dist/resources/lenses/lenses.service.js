"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const lenses_model_1 = __importDefault(require("@/resources/lenses/lenses.model"));
//import { promises as fs } from 'fs';
const fs = __importStar(require("fs"));
class LensesService {
    constructor() {
        this.lenses = lenses_model_1.default;
    }
    randGen(length) {
        const abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let name = '';
        while (name.length < length) {
            name += abc[Math.floor(Math.random() * abc.length)];
        }
        return name;
    }
    getNameVariable(variable, fileName, fileExtension) {
        const query = fileName.split('.' + fileExtension)[0];
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        console.log('Query variable %s not found', variable);
    }
    getFileExtension(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? '' : ext[1];
    }
    create(manufacturer, country, material, coating, description, images, name, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileNames = [];
                if (images && images.length > 10) {
                    throw new Error('Maximum number of files 10');
                }
                if (images && images.length > 0) {
                    for (let i = 0; i < images.length; i++) {
                        if (images[i].buffer.length > 10000000) {
                            throw new Error('Maximum file size 10 MB');
                        }
                        if (images[i].originalname.indexOf('color') < 0) {
                            throw new Error('Color must be included in the title of the image.');
                        }
                    }
                    yield Promise.all(images.map((item, index) => {
                        const fileExtension = this.getFileExtension(item.originalname);
                        const color = this.getNameVariable('color', item.originalname, fileExtension);
                        const randString = this.randGen(24);
                        const fileName = randString +
                            '_' +
                            color +
                            '_' +
                            Date.now() +
                            '_' +
                            `${new Date().toISOString().slice(0, 10)}` +
                            '.' +
                            fileExtension;
                        if (!fs.existsSync(`./src/images`)) {
                            fs.mkdirSync(`./src/images`);
                        }
                        if (!fs.existsSync(`./src/images/${new Date()
                            .toISOString()
                            .slice(0, 10)}`)) {
                            fs.mkdirSync(`./src/images/${new Date()
                                .toISOString()
                                .slice(0, 10)}`);
                        }
                        fs.promises.writeFile(`./src/images/${new Date()
                            .toISOString()
                            .slice(0, 10)}/${fileName}`, item.buffer, 'binary');
                        fileNames.push(fileName);
                    }));
                }
                const lenses = yield this.lenses.create({
                    manufacturer,
                    country,
                    material,
                    coating,
                    description,
                    images: fileNames,
                    name,
                    type,
                });
                return lenses;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    update(_id, manufacturer, country, material, coating, description, images, name, type, prevImages) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lensesTemp = yield this.lenses.findById(_id);
                if (!lensesTemp) {
                    throw new Error('Unable to find lenses');
                }
                if (!images) {
                    prevImages = lensesTemp.images;
                }
                if (images && images.length + prevImages.length > 10) {
                    throw new Error('Maximum number of files 10');
                }
                if (images && images.length > 0) {
                    for (let i = 0; i < images.length; i++) {
                        if (images[i].buffer.length > 10000000) {
                            throw new Error('Maximum file size 10 MB');
                        }
                    }
                    yield Promise.all(images.map((item, index) => {
                        const fileExtension = this.getFileExtension(item.originalname);
                        const color = this.getNameVariable('color', item.originalname, fileExtension);
                        const randString = this.randGen(24);
                        const fileName = randString +
                            '_' +
                            color +
                            '_' +
                            Date.now() +
                            '_' +
                            `${new Date().toISOString().slice(0, 10)}` +
                            '.' +
                            fileExtension;
                        if (!fs.existsSync(`./src/images`)) {
                            fs.mkdirSync(`./src/images`);
                        }
                        if (!fs.existsSync(`./src/images/${new Date()
                            .toISOString()
                            .slice(0, 10)}`)) {
                            fs.mkdirSync(`./src/images/${new Date()
                                .toISOString()
                                .slice(0, 10)}`);
                        }
                        fs.promises.writeFile(`./src/images/${new Date()
                            .toISOString()
                            .slice(0, 10)}/${fileName}`, item.buffer, 'binary');
                        prevImages.push(fileName);
                    }));
                }
                const lenses = yield this.lenses.findByIdAndUpdate(_id, {
                    manufacturer,
                    country,
                    material,
                    coating,
                    description,
                    images: prevImages,
                    name,
                    type,
                }, { new: true });
                if (!lenses) {
                    throw new Error('Unable to update lenses with thad data');
                }
                return lenses;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    delete(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let lenses = (yield this.lenses.findById(_id));
                if (!lenses) {
                    throw new Error('Unable to find lenses with that data');
                }
                lenses.images.map((item) => {
                    fs.unlink(`./src/images/${item.split('_')[3].split('.')[0]}/${item}`, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                });
                const removedLenses = yield this.lenses.findByIdAndDelete(_id);
                if (!removedLenses) {
                    throw new Error('Unable to delete lenses with that data');
                }
                return removedLenses;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    deleteImage(_id, url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let lenses = (yield this.lenses.findById(_id));
                if (!lenses) {
                    throw new Error('Unable to find lenses with that data');
                }
                if (lenses.images.includes(url)) {
                    lenses = (yield this.lenses.findByIdAndUpdate(_id, { $pullAll: { images: [url] } }, { new: true }));
                    fs.unlink(`./src/images/${url.split('_')[3].split('.')[0]}/${url}`, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                }
                return lenses;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    find(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lenses = yield this.lenses.find(props, null, {
                    sort: { createdAt: -1 },
                });
                if (!lenses) {
                    throw new Error('Unable to find lenses with that data');
                }
                const b = [];
                return lenses;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = LensesService;
