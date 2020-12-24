"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiRouter_1 = __importDefault(require("./apiRouter"));
const SERVER_PORT = process.env.PORT || 3000;
const app = express_1.default();
app.use('/api', apiRouter_1.default);
app.use(express_1.default.static('public'));
app.listen(SERVER_PORT);
console.log(`Server listening on port ${SERVER_PORT}...`);
exports.default = app;
