import chai from 'chai';
import app from '../index';
import Helper from '../server/helpers/helper.functions';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import  sinon from 'sinon';

chai.use(chaiHttp, spies);
const {
    expect
} = chai;

describe('Testing social authentication', () => {
    
    it('should login using with facebook', (done) => {
        let payload = {
             social_auth_id: 'klhubhnjkhhhkj',
             email: 'francis@gmail.com',
             username: 'Francis Kiryowa',
         };
        chai.request(app)
            .get('/api/users/auth/facebook')
            .end((err, res) => {
                sinon.spy(Helper, 'generateToken');
                Helper.generateToken(payload, res);
                expect(Helper.generateToken.calledOnce).to.be.true;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('should login using with facebook throws error', (done) => {
        chai.request(app)
            .get('/api/users/auth/fa')
            .end((err, res) => {
                expect(res.status).to.be.equal(404);
                done();
            });
    });

    it('should login using with twitter', (done) => {
         chai.request(app)
             .get('/api/users/auth/twitter')
             .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 done();
             });
     });

    it('should login using with twitter', (done) => {
        chai.request(app)
            .get('/api/users/auth/google')
            .end((err, res) => {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});
