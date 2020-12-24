import server from '../src/index'  
import chaiHttp from 'chai-http'
import chai from 'chai'

// NODE_ENV = 'test';
chai.use(chaiHttp);
const expect  = chai.expect;
const request = chai.request;

describe('API', () => {

    describe('GET /', () => {
        it('responds with 200 and html', async () => {
            const res = await request(server)
                                .get('/');

            expect(res).to.be.html;
            expect(res).to.have.status(200);
        });
    });
    
    describe('POST /api/info', () => {
        it('given videoID of a publically available video, responds with 200 and JSON that contains an array of objects',  async () => {
            const res = await request(server)
                                .post('/api/info')
                                .send({"videoID": "OrxmtDw4pVI"});

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');  
        }).timeout(3000);

        it('given an invalid videoID, responds with 400 and an Error', async () => {
            const res = await request(server)
                                .post('/api/info')
                                .send({"videoID": "qwerty"});

            expect(res).to.have.status(400);
            expect(res.body.error).to.include('No video id found');
        });
    });

    describe('POST /api/download', () => {
        it('given videoID of a publically available video and valid quality, responds with 200 and video contents', async () => {
            const res = await request(server)
                                .post('/api/download')
                                .send({
                                    "videoID": "OrxmtDw4pVI",
                                    "quality": "18" 
                                });
 
            expect(res).to.have.status(200);
            expect(res).to.have.header('Content-Type', 'video/mp4');        
        }).timeout(0);
    
        it('given videoID of a publically available video but invalid quality, responds with 400 and and error', async () => {
            const res = await request(server)
                                .post('/api/download')
                                .send({
                                    "videoID": "OrxmtDw4pVI",
                                    "quality": "19" 
                                });
            expect(res).to.have.status(400);
            expect(res).to.be.json;   
            expect(res.body.error).to.include('No such format found:');
        });
    });
});