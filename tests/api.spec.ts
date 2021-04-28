import server from '../src/server/index'
import chaiHttp from 'chai-http'
import chai from 'chai'
import fs from 'fs'

// NODE_ENV = 'test';
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

describe('API', function() {
this.timeout(30000)

    describe('GET /', function() {
        it('responds with 200 and html', async function() {
            const res = await request(server)
                .get('/');

            expect(res).to.be.html;
            expect(res).to.have.status(200);
        });
    });

    describe('POST /api/info', function() {
        it('given videoID of a publically available video, responds with 200 and JSON that contains an array of objects', async function() {
            const res = await request(server)
                .post('/api/info')
                .send({ "videoID": "OrxmtDw4pVI" });

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });

        it('given an invalid videoID, responds with 400 and an Error', async function() {
            const res = await request(server)
                .post('/api/info')
                .send({ "videoID": "qwerty" });

            expect(res).to.have.status(400);
            expect(res.body.error).to.include('No video id found');
        });

        it('given videoID of an unavailable video, responds with 400 and an Error', async function() {
            const res = await request(server)
                .post('/api/info')
                .send({
                    "videoID": "U_RAWwgCwS1",
                    "quality": "19"
                });
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body.error).to.include('Video unavailable');
        });

        it('given an invalid videoID, responds with 400 and an Error', async function() {
            const res = await request(server)
                .post('/api/info')
                .send({
                    "videoID": "U_RAWwgCwS1)",
                    "quality": "19"
                });
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body.error).to.include('No video id found');
        });
    });

    describe('POST /api/download', function() {
        it('given videoID of a publically available video and valid quality, responds with 200 and video contents', async function() {
            const res = await request(server)
                .post('/api/download')
                .send({
                    "videoID": "ZOzzRlc_qho",
                    "quality": "18"
                });

            expect(res).to.have.status(200);
            expect(res).to.have.header('Content-Type', 'video/mp4');
        }).timeout(0);

        it('given videoID of a publically available video but invalid quality, responds with 400 and an Error', async function() {
            const res = await request(server)
                .post('/api/download')
                .send({
                    "videoID": "ZOzzRlc_qho",
                    "quality": "19"
                });
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body.error).to.include('No such format found:');
        });
    });

    describe.only('POST /api/network-stream', function() {
        it('given videoID of a publically available video and valid quality, responds with 200 and a valid url', async function() {
            const res = await request(server)
                .post('/api/network-stream')
                .send({
                    "videoID": "ZOzzRlc_qho",
                    "quality": "18"
                });

            expect(res).to.have.status(200);
            expect(res).to.have.header('Content-Type', 'application/json; charset=utf-8');
            expect(res).to.be.json;
            expect(res.body).to.match(/http:\/\/.*\/vids\/\w+\.mp4/)
            expect(fs.existsSync('./public/vids')).to.be.true;
        });

        it('given videoID of a publically available video but invalid quality, responds with 400 and an Error', async function() {
            const res = await request(server)
                .post('/api/network-stream')
                .send({
                    "videoID": "ZOzzRlc_qho",
                    "quality": "19"
                });
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body.error).to.include('No such format found:');
        })
    })
});