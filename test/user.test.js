import chai from 'chai';
import app from '../index';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
const {
    expect
} = chai;

describe('test index', () => {
    it('Welcome to the beginning of nothingness.', (done) => {
        chai.request(app)
            .get('/')
            .end((error, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.deep.property('message', 'Welcome to the beginning of nothingness.');
                done();
            });
    });

    it('should return resource not found message if endpoint does not exist', (done) => {
        chai
            .request(app)
            .get('/ii')
            .end((error, res) => {
                expect(res.status).to.be.equal(404);
                expect(res.body).to.have.deep.property('error', 'Resource not found');
                done();
            });
    });

    it('should sign up', (done) => {
        chai
            .request(app)
            .post('/api/users/register')
            .send({
              	username: "kiryowa22",
              	email: "daddyfelix56@gmail.com",
              	password: "kiryowa@1993"
            })
            .set('Accept', 'Application/JSON')
            .end((error, res) => {
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.deep.property('success', true);
                expect(res.body).to.have.deep.property('message', 'Verification Email Has Been Successfully Sent');
                done();
            });
      });

    it('should throw error when user exists', (done) => {
        chai
            .request(app)
            .post('/api/users/register')
            .send({
                username: "kiryowa22",
                email: "daddyfelix56@gmail.com",
                password: "kiryowa@1993"
            })
            .end((error, res) => {
                expect(res.status).to.be.equal(409);
                expect(res.body).to.have.deep.property(
                    'email', 'Email already exists'
                );
                done();
            });
    });
});

