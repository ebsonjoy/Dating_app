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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.find({}).exec();
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to retrieve items");
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.model.findById(id).exec();
            if (!item)
                throw new Error("Item not found");
            return item;
        });
    }
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.create(item);
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to create item");
            }
        });
    }
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.model
                .findByIdAndUpdate(id, item, { new: true })
                .exec();
            if (!updated)
                throw new Error("Item not found");
            return updated;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findByIdAndDelete(id).exec();
                return !!result;
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to delete item");
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
