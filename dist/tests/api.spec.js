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
const index_1 = __importDefault(require("../src/index"));
const chai_http_1 = __importDefault(require("chai-http"));
const chai_1 = __importDefault(require("chai"));
// NODE_ENV = 'test';
chai_1.default.use(chai_http_1.default);
const expect = chai_1.default.expect;
const request = chai_1.default.request;
describe('API', () => {
    describe('GET /', () => {
        it('responds with 200 and html', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(index_1.default)
                .get('/');
            expect(res).to.be.html;
            expect(res).to.have.status(200);
        }));
    });
    describe('POST /api/info', () => {
        it('given videoID of a publically available video, responds with 200 and JSON that contains an array of objects', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(index_1.default)
                .post('/api/info')
                .send({ "videoID": "OrxmtDw4pVI" });
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        })).timeout(3000);
        it('given an invalid videoID, responds with 400 and an Error', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(index_1.default)
                .post('/api/info')
                .send({ "videoID": "qwerty" });
            expect(res).to.have.status(400);
            expect(res.body.error).to.include('Invalid video ID');
        }));
    });
    describe('POST /api/download', () => {
        it('given videoID of a publically available video and valid quality, responds with 200 and video contents', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(index_1.default)
                .post('/api/download')
                .send({
                "videoID": "OrxmtDw4pVI",
                "quality": "18"
            })
                .then((res) => {
                expect(res).to.have.status(200);
            })
                .catch((err) => {
                throw err;
            });
        })).timeout(0);
        it('given videoID of a publically available video and an INvalid quality, responds with 400 and and error', () => __awaiter(void 0, void 0, void 0, function* () { }));
    });
});
