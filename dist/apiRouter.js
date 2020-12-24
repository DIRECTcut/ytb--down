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
    // ytdl.getInfo(videoID)
    if (!ytdl_core_1.default.validateID(videoID)) {
        const error = new Error('Invalid video ID');
        res.status(400).json({ error: error.toString() });
    }
    else {
        const videoFormats = yield (yield ytdl_core_1.default.getInfo(videoID)).formats;
        res.setHeader('Content-type', 'application/json');
        res.send(videoFormats);
    }
}));
router.post('/download', body_parser_1.default.json(), (req, res, next) => {
    const video = ytdl_core_1.default(req.body.videoID, { quality: req.body.quality });
    const stream = video.pipe(res);
    stream.on('error', (err) => next(err));
    stream.on('end', () => {
        res.header('Content-Type', 'video/mp4').status(200).end();
    });
});
exports.default = router;
