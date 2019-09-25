import chai from 'chai';
import app from '../index';
import UserController from '../server/controllers/user';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
const {
    expect
} = chai;

let userToken;
let userAuthToken;
let secondUserAuthToken;
let userToken2;

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
            .post('/api/users/auth/register')
            .send({
              	username: "kiryowa22",
              	email: "francis.kiryowa@andela.com",
              	password: "kiryowa@1993"
            })
            .set('Accept', 'Application/JSON')
            .end((error, res) => {
                userToken = res.body.userToken;
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.deep.property('success', true);
                expect(res.body).to.have.deep.property('message', 'Verification Email Has Been Successfully Sent');
                done();
            });
      });

        it('should sign up a second user', (done) => {
              chai
                  .request(app)
                  .post('/api/users/auth/register')
                  .send({
                      username: "acio22",
                      email: "daddyfelix56@gmail.com",
                      password: "kiryowa@1993"
                  })
                  .set('Accept', 'Application/JSON')
                  .end((error, res) => {
                      secondUserAuthToken = res.body.userToken;
                      expect(res.status).to.be.equal(201);
                      expect(res.body).to.have.deep.property('success', true);
                      expect(res.body).to.have.deep.property('message', 'Verification Email Has Been Successfully Sent');
                      done();
                  });
          });

    it('should verify user registration', (done) => {
        chai
            .request(app)
            .get(`/api/users/auth/verify-user-account/${userToken}`)
            .end((error, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.deep.property('success', true);
                expect(res.body).to.have.deep.property('message', 'Account Successfully Verified');
                done();
            });
    });

    it('should verify user registration', (done) => {
        chai
            .request(app)
            .get(`/api/users/auth/verify-user-account/${secondUserAuthToken}`)
            .end((error, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.deep.property('success', true);
                expect(res.body).to.have.deep.property('message', 'Account Successfully Verified');
                done();
            });
    });

    it('should verify user registration throw error', (done) => {
        chai
        .request(app)
        .get(`/api/users/auth/${userToken}`)
        .end((error, res) => {
            expect(res.status).to.be.equal(404);
            expect(res.body).to.have.deep.property('error', 'Resource not found');
            done();
        });
    });

    it('should throw error when user exists', (done) => {
        chai
            .request(app)
            .post('/api/users/auth/register')
            .send({
                username: "kiryowa22",
                email: "francis.kiryowa@andela.com",
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

    it('should sign in the user', (done) => {
        chai
            .request(app)
            .post('/api/users/auth/login')
            .send({
                email: 'francis.kiryowa@andela.com',
                password: 'kiryowa@1993'
            })
            .set('Accept', 'Application/JSON')
            .end((error, res) => {
                const { token } = res.body;
                userAuthToken =  token;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.deep.property('success', true);
                expect(res.body).to.have.property('token');
                done();
            });
    });

     it('should sign in the  second user', (done) => {
         chai
             .request(app)
             .post('/api/users/auth/login')
             .send({
                 email: 'daddyfelix56@gmail.com',
                 password: 'kiryowa@1993'
             })
             .set('Accept', 'Application/JSON')
             .end((error, res) => {
                 const {
                     token
                 } = res.body;
                 userToken2 = token;
                 expect(res.status).to.be.equal(200);
                 expect(res.body).to.have.deep.property('success', true);
                 expect(res.body).to.have.property('token');
                 done();
             });
     });
    

    it('should update user profile', (done) => {
          chai
              .request(app)
              .put('/api/profile/users/kiryowa22')
              .set('Authorization', userAuthToken)
              .send({
                   firstname: "Francis",
                   lastname: "Kiryowa",
                   bio: "Am a sports glu, coding is my thing"
              })
              .end((error, res) => {
                  expect(res.status).to.be.equal(200);
                  expect(res.body).to.have.deep.property('message', 'Profile has been successfully updated');
                  done();
              });
    });

    it('should get a user profile', (done) => {
        chai
            .request(app)
            .get('/api/profile/users/kiryowa22')
            .end((error, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.deep.property('message', 'kiryowa22 user profile');
                done();
            });
    });

    it('should get a user profile does not exist', (done) => {
        chai
            .request(app)
            .get('/api/profile/users/kir')
            .end((error, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.deep.property('message', 'User Not Found');
                done();
            });
    });

    it('should update user does not update profile that is not theirs', (done) => {
        chai
            .request(app)
            .put('/api/profile/users/kiryowa22')
            .set('Authorization', userToken2)
            .send({
                firstname: "Francis",
                lastname: "Kiryowa",
                bio: "Am a sports glu, coding is my thing"
            })
            .end((error, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.deep.property('message', 'You can not update a profile that does not belong to you');
                done();
            });
    });

     it('should update user profile user not found', (done) => {
         chai
             .request(app)
             .put('/api/profile/users/kiryowa22')
             .set('Authorization', userAuthToken)
             .send({
                 firstname: "Francis",
                 lastname: "Kiryowa",
                 bio: "Am a sports glu, coding is my thing"
             })
             .end((error, res) => {
                 expect(res.status).to.be.equal(200);
                 expect(res.body).to.have.deep.property('message', 'Profile has been successfully updated');
                 done();
             });
     });

      it('should update user profile user profile data', (done) => {
          chai
              .request(app)
              .put('/api/profile/users/kiryowa22')
              .set('Authorization', userAuthToken)
              .end((error, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.have.deep.property('message', 'Profile has been successfully updated');
                    done();
              });
      });

    it('should test request password reset', (done) => {
        chai
            .request(app)
            .post('/api/users/auth/password-reset')
            .send({
                email: 'francis.kiryowa@andela.com',
            })
            .set('Accept', 'Application/JSON')
            .end((error, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.deep.property('success', true);
                expect(res.body).to.have.deep.property('message', 'Email Has Been Successfully Sent, Check your email');
                done();
            });
    });

    it('should test reset password', (done) => {
        chai
            .request(app)
            .post(`/api/users/auth/password-reset-request/${userToken}`)
            .send({
               password: "kiryowa22",
            })
            .set('Accept', 'Application/JSON')
            .end((error, res) => {
                userToken = res.body.userToken;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.deep.property('success', true);
                expect(res.body).to.have.deep.property('message', 'Password Successfully Changed');
                done();
            });
    });
    

    it('should test reset password throw an error', (done) => {
        chai
            .request(app)
            .post(`/api/users/auth/${userToken}`)
            .send({
                password: "kiryowa22",
            })
            .set('Accept', 'Application/JSON')
            .end((error, res) => {
                userToken = res.body.userToken;
                expect(res.status).to.be.equal(404);
                expect(res.body).to.have.deep.property('error', 'Resource not found');
                done();
            });
    });


});

