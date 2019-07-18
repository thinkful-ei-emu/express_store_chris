const app = require('../src/app');

describe('App', () => {
  describe('GET 200 confirmation testing', () => {
    it('Get / responds with 200 containing "Hello, world!"', () => {
      return supertest(app)
        .get('/')
        .expect(200, 'A GET Request');
    });
    it('GET /user should return an object and respond with 200', () => {
      return supertest(app)
        .get('/user')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.be.an('object');
          expect(res.body[0]).to.include.all.keys('id', 'username', 'password', 'favoriteClub', 'newsLetter');
        });
    });
  });
  describe('POST', () => {
    it('POST / responds with 200 containing POST request received', () => {
      return supertest(app)
        .post('/')
        .expect(200, 'POST request received');
    });
    describe('Check that the server will reject a bad sign-up', () => {
      it('POST /user responds with 400 if no username information is entered', () => {
        const userVals = ['username', 'password', 'newsLetter'];
        return supertest(app)
          .post('/user')
          .expect(400, 'Username required');
      });
      it('POST /user responds with 400 if no password information is entered', () => {
        return supertest(app)
          .post('/user')
          .send({username: 'john'})
          .expect(400, 'Password required');
      });
      it('POST /user responds with 400 if no favorite club information is entered', () => {
        return supertest(app)
          .post('/user')
          .send({username: 'john', password: 'steve'})
          .expect(400, 'Favorite Club required');
      });
      it('POST /user responds with 400 if username format is incorrect', () => {
        return supertest(app)
          .post('/user')
          .send({username: 'john', password: 'steve', favoriteClub: 'jobs'})
          .expect(400, 'Username must be between 6 and 20 characters');
      });
      it('POST /user responds with 400 if password format is not long enough', () => {
        return supertest(app)
          .post('/user')
          .send({username: 'johnnywalk', password: 'steve', favoriteClub: 'jobs'})
          .expect(400, 'Password must be between 8 and 36 characters');
      });
      it('POST /user responds with 400 if password doesn\'t include a number', () => {
        return supertest(app)
          .post('/user')
          .send({username: 'johnnywalk', password: 'stevejobs', favoriteClub: 'jobs'})
          .expect(400, 'Password must contain at least one digit');
      });
      it('POST /user responds with 400 if password doesn\'t include a number', () => {
        return supertest(app)
          .post('/user')
          .send({username: 'johnnywalk', password: 'stevejobs1', favoriteClub: 'jobs'})
          .expect(400, 'Not a valid club');
      });
    });
    it('POST /user responds with 200 for a clean submital', () => {
      return supertest(app)
        .post('/user')
        .send({username: 'johnnywalk', password: 'stevejobs1', favoriteClub: 'Ogden Curling Club'})
        .expect(204);
    });
  });
  describe('DELETE', () => {
    it('Should give a 404 when trying to delete a nonexistant user', () => {
      return supertest(app)
        .del('/user/3c8da4d5')
        .expect(404, 'User not found');
    });
    it('Should give a 204 when the user is correctly deleted', () => {
      const users = [{
        'id': '3c8da4d5-1597-46e7-baa1-e402aed70d80',
        'username': 'sallyStudent',
        'password': 'c00d1ng1sc00l',
        'favoriteClub': 'Cache Valley Stone Society',
        'newsLetter': 'true'
      }];
      return supertest(app)
        .del('/user/3c8da4d5-1597-46e7-baa1-e402aed70d80')
        .expect(204);
    });
  });
});