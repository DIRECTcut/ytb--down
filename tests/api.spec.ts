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
            expect(res.body.error).to.include('Invalid video ID');
        });
    });

    describe('POST /api/download', () => {
        it('given videoID of a publically available video and valid quality, responds with 200 and video contents', async () => {
            const res = await request(server)
                                .post('/api/download')
                                .send({
                                    "videoID": "OrxmtDw4pVI",
                                    "quality": "18" 
                                })
                                .then( (res) => {
                                    expect(res).to.have.status(200);
                                })
                                .catch( (err) => {
                                    throw err;
                                });
        }).timeout(0);
    
        it('given videoID of a publically available video and an INvalid quality, responds with 400 and and error', async () => {});
    });

});