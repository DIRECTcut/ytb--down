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
const express_1 = __importDefault(require("express"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const body_parser_1 = __importDefault(require("body-parser"));
const router = express_1.default.Router();
router.post('/info', body_parser_1.default.json(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const videoID = req.body.videoID;
    try {
        ytdl_core_1.default.getInfo(videoID)
            .then(info => res.json(info.formats));
    }
    catch (err) {
        res.status(400).send({ error: err.message });
        next();
    }
}));
router.post('/download', body_parser_1.default.json(), (req, res, next) => {
    const stream = ytdl_core_1.default(req.body.videoID, { quality: req.body.quality });
    res.setHeader('Content-Type', 'video/mp4');
    stream.pipe(res);
    stream.on('error', (err) => {
        res.removeHeader('Content-Type');
        res.status(400).send({ error: err.message });
        next();
    });
});
exports.default = router;
