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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdviceService = void 0;
const inversify_1 = require("inversify");
const multer_1 = require("../../config/multer");
let AdviceService = class AdviceService {
    constructor(AdviceRepository) {
        this.AdviceRepository = AdviceRepository;
    }
    //Category
    createCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCategory = yield this.AdviceRepository.findCategoryByName(categoryData.name);
                if (existingCategory) {
                    throw new Error(`Catergory with name "${categoryData.name}" already exists.`);
                }
                return yield this.AdviceRepository.createCategory(categoryData);
            }
            catch (error) {
                console.log('Error in addNewCatergory:', error);
                throw error;
            }
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.AdviceRepository.getCategories();
                if (!categories) {
                    return [];
                }
                return categories;
            }
            catch (error) {
                console.log('Error in addNewArticle:', error);
                throw error;
            }
        });
    }
    blockAdviceCategory(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.AdviceRepository.blockAdviceCategory(id, status);
                if (!category)
                    throw new Error('category not found');
                return category;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to toggle category status');
            }
        });
    }
    getSingleAdviceCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.AdviceRepository.getSingleAdviceCategory(categoryId);
                if (!category)
                    throw new Error('category not found');
                return category;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to toggle category status');
            }
        });
    }
    updateAdiveCategory(id, updateData, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentCategory = yield this.AdviceRepository.getSingleAdviceCategory(id);
                if (!currentCategory) {
                    throw new Error('Category not found');
                }
                if (updateData.name && updateData.name !== currentCategory.name) {
                    const existingPlan = yield this.AdviceRepository.findCategoryByName(updateData.name);
                    if (existingPlan) {
                        throw new Error(`Category with name "${updateData.name}" already exists.`);
                    }
                }
                if (file) {
                    yield (0, multer_1.deleteImageFromS3)(currentCategory.image);
                    updateData.image = file.location;
                }
                else {
                    updateData.image = currentCategory.image;
                }
                const category = yield this.AdviceRepository.updateAdiveCategory(id, updateData);
                if (!category)
                    throw new Error('Plan not found');
                return category;
            }
            catch (error) {
                console.log('Failed to edit category', error);
                throw error;
            }
        });
    }
    // Article
    createArticle(articleData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingArticle = yield this.AdviceRepository.findArticleByTitle(articleData.title);
                if (existingArticle) {
                    throw new Error(`Catergory with name "${articleData.title}" already exists.`);
                }
                return yield this.AdviceRepository.createArticle(articleData);
            }
            catch (error) {
                console.log('Error in addNewArticle:', error);
                throw error;
            }
        });
    }
    getArticles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const article = yield this.AdviceRepository.getArticles();
                if (!article) {
                    return [];
                }
                return article;
            }
            catch (error) {
                console.log('Error in addNewArticle:', error);
                throw error;
            }
        });
    }
    findArticleByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const article = yield this.AdviceRepository.findArticleByTitle(title);
                if (!article)
                    throw new Error('Article not found');
                return article;
            }
            catch (error) {
                console.log('Error in findArticleByTitle:', error);
                throw error;
            }
        });
    }
    getArticlesByCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const articles = yield this.AdviceRepository.getArticlesByCategory(categoryId);
                if (!articles || articles.length === 0) {
                    return [];
                }
                return articles;
            }
            catch (error) {
                console.log('Error in getArticlesByCategory:', error);
                throw error;
            }
        });
    }
    updateArticle(articleId, updateData, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentArticle = yield this.AdviceRepository.getSingleArtilce(articleId);
                if (!currentArticle) {
                    throw new Error('Category not found');
                }
                if (updateData.title && updateData.title !== currentArticle.title) {
                    const existingArticleName = yield this.AdviceRepository.findArticleByTitle(updateData.title);
                    if (existingArticleName) {
                        throw new Error(`Article with title "${updateData.title}" already exists.`);
                    }
                }
                if (file) {
                    yield (0, multer_1.deleteImageFromS3)((currentArticle === null || currentArticle === void 0 ? void 0 : currentArticle.image) || '');
                    updateData.image = file.location;
                }
                else {
                    updateData.image = currentArticle === null || currentArticle === void 0 ? void 0 : currentArticle.image;
                }
                return yield this.AdviceRepository.updateArticle(articleId, updateData);
            }
            catch (error) {
                console.log('Error in updateArticle:', error);
                throw error;
            }
        });
    }
    deleteArticle(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const article = yield this.AdviceRepository.deleteArticle(articleId);
                if (!article)
                    throw new Error('Article not found');
                if (article.image) {
                    yield (0, multer_1.deleteImageFromS3)(article.image);
                }
                return article;
            }
            catch (error) {
                console.log('Error in deleteArticle:', error);
                throw error;
            }
        });
    }
    blockArticle(articleId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const article = yield this.AdviceRepository.blockArticle(articleId, status);
                if (!article)
                    throw new Error('Article not found');
                return article;
            }
            catch (error) {
                console.log('Error in blockArticle:', error);
                throw error;
            }
        });
    }
    getSingleArticle(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const article = yield this.AdviceRepository.getSingleArtilce(articleId);
                if (!article)
                    throw new Error('category not found');
                return article;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to toggle category status');
            }
        });
    }
};
exports.AdviceService = AdviceService;
exports.AdviceService = AdviceService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAdviceRepository')),
    __metadata("design:paramtypes", [Object])
], AdviceService);
