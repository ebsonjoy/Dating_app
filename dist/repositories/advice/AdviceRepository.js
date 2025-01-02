"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.AdviceRepository = void 0;
const inversify_1 = require("inversify");
const AdviceCategory_1 = __importDefault(require("../../models/AdviceCategory"));
const Article_1 = __importDefault(require("../../models/Article"));
let AdviceRepository = class AdviceRepository {
    constructor(AdviceCategoryModel = AdviceCategory_1.default, ArticleModel = Article_1.default) {
        this.AdviceCategoryModel = AdviceCategoryModel;
        this.ArticleModel = ArticleModel;
    }
    //category
    createCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AdviceCategoryModel.create(categoryData);
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AdviceCategoryModel.find();
        });
    }
    findCategoryByName(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AdviceCategoryModel.findOne({ categoryName });
        });
    }
    blockAdviceCategory(id, isBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AdviceCategoryModel.findByIdAndUpdate(id, { isBlock }, { new: true });
        });
    }
    getSingleAdviceCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AdviceCategoryModel.findById(categoryId).exec();
        });
    }
    updateAdiveCategory(id, category) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AdviceCategoryModel.findByIdAndUpdate(id, category, { new: true });
        });
    }
    // article
    createArticle(articleData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ArticleModel.create(articleData);
        });
    }
    getArticles() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ArticleModel.find().exec();
        });
    }
    findArticleByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ArticleModel.findOne({ title }).exec();
        });
    }
    getArticlesByCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ArticleModel.find({ categoryId }).exec();
        });
    }
    updateArticle(articleId, articleData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ArticleModel.findByIdAndUpdate(articleId, articleData, { new: true });
        });
    }
    deleteArticle(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ArticleModel.findByIdAndDelete(articleId).exec();
        });
    }
    blockArticle(articleId, isBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ArticleModel.findByIdAndUpdate(articleId, { isBlock }, { new: true });
        });
    }
    getSingleArtilce(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ArticleModel.findById(articleId).exec();
        });
    }
};
exports.AdviceRepository = AdviceRepository;
exports.AdviceRepository = AdviceRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object, Object])
], AdviceRepository);
