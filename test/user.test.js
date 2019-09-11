import chai from 'chai';
import app from '../index';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
const {
    expect
} = chai;

describe('test index', () => {
    it('should return welcome to author\'s heaven', (done) => {
        chai.request(app)
            .get('/')
            .end((error, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.deep.property('message', 'Welcome to the beginning of nothingness.');
                done();
            });
    });
});

