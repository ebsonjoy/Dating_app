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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdviceController = void 0;
const inversify_1 = require("inversify");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const StatusMessage_1 = require("../../enums/StatusMessage");
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
let AdviceController = class AdviceController {
    constructor(adviceService) {
        this.adviceService = adviceService;
        //category
        this.createAdviceCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, description } = req.body;
            const file = req.file;
            if (!file) {
                res.status(400).json({ error: "Image is required" });
                return;
            }
            const imageUrl = file.location;
            try {
                const categoryData = {
                    name,
                    description,
                    image: imageUrl,
                };
                console.log(categoryData);
                const newCategory = yield this.adviceService.createCategory(categoryData);
                res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json(newCategory);
            }
            catch (error) {
                if (error.message.includes("already exists")) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                        errors: [error.message],
                    });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                        errors: [StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR],
                    });
                }
            }
        }));
        this.getAdviceCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('hlll');
            try {
                const categories = yield this.adviceService.getCategories();
                console.log(categories);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(categories);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.blockAdviceCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { categoryId } = req.params;
            const { newStatus } = req.body;
            try {
                const updatedCategory = yield this.adviceService.blockAdviceCategory(categoryId, newStatus);
                if (!updatedCategory) {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                    return;
                }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: 'Plan status updated successfully', category: updatedCategory });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.getSingleAdviceCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { categoryId } = req.params;
            try {
                const category = yield this.adviceService.getSingleAdviceCategory(categoryId);
                if (!category) {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                    return;
                }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(category);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.updateAdviceCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { categoryId } = req.params;
            const updateData = req.body;
            const file = req.file;
            try {
                const updatedCategory = yield this.adviceService.updateAdiveCategory(categoryId, updateData, file);
                if (!updatedCategory) {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                    return;
                }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(updatedCategory);
            }
            catch (error) {
                console.log(error);
                if (error.message.includes("already exists")) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                        errors: [error.message],
                    });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
                }
            }
        }));
        //Article
        this.createArticle = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { title, content, categoryId } = req.body;
            const file = req.file;
            if (!file) {
                res.status(400).json({ error: "Image is required" });
                return;
            }
            const imageUrl = file.location;
            try {
                const articleData = {
                    title,
                    content,
                    categoryId,
                    image: imageUrl
                };
                const newArticle = yield this.adviceService.createArticle(articleData);
                res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json(newArticle);
            }
            catch (error) {
                if (error.message.includes("already exists")) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                        errors: [error.message],
                    });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                        errors: [StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR],
                    });
                }
            }
        }));
        this.getArticles = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const articles = yield this.adviceService.getArticles();
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(articles);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.getArticlesByCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { categoryId } = req.params;
            try {
                const articles = yield this.adviceService.getArticlesByCategory(categoryId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(articles);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.updateArticle = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { articleId } = req.params;
            const updateData = req.body;
            const file = req.file;
            try {
                const updatedArticle = yield this.adviceService.updateArticle(articleId, updateData, file);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(updatedArticle);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.deleteArticle = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { articleId } = req.params;
            try {
                const deletedArticle = yield this.adviceService.deleteArticle(articleId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: 'Article deleted successfully', article: deletedArticle });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.blockArticle = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { articleId } = req.params;
            const { newStatus } = req.body;
            try {
                const blockedArticle = yield this.adviceService.blockArticle(articleId, newStatus);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: 'Article status updated successfully', article: blockedArticle });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.getSingleArticle = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { articleId } = req.params;
            try {
                const article = yield this.adviceService.getSingleArticle(articleId);
                if (!article) {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                    return;
                }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(article);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
    }
};
exports.AdviceController = AdviceController;
exports.AdviceController = AdviceController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("IAdviceService")),
    __metadata("design:paramtypes", [Object])
], AdviceController);
