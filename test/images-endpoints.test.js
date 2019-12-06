const app = require('../src/app');
const TestHelpers = require('./test-helpers');

describe.only('Images Endpoints', () => {
  let db = TestHelpers.setupTestDB(app);
  const mockUsers = TestHelpers.mockUsers();
  const mockSubmissions = TestHelpers.mockSubmissions();
  const coordinatesGreenwich = TestHelpers.coordinatesGreenwich();
  const coordinatesQuito = TestHelpers.coordinatesQuito();
  const endpointPath = '/api/images';

  /*****************************************************************
    SETUP
  ******************************************************************/
  before('cleanup', () => TestHelpers.truncateAllTables(db));

  afterEach('cleanup', () => TestHelpers.truncateAllTables(db));

  after('disconnect from db', () => db.destroy());

  /*****************************************************************
    GET /api/images
  ******************************************************************/
  describe(`GET ${endpointPath}`, () => {
    context('Given Invalid Query Params', () => {
      const expectedMsg1 = 'Invalid value provided for sort param';
      it(`responds 400 "${expectedMsg1}" when sort param is invalid`, () => {
        const query = '/?sort=invalid';
        return supertest(app)
          .get(`${endpointPath}${query}`)
          .expect(400, { error: expectedMsg1 });
      });

      const expectedMsg2 = 'lat and lon parameters are required';
      it(`responds 400 "${expectedMsg2}" when lat and lon params are not provided`, () => {
        const query = '/?sort=new';
        return supertest(app)
          .get(`${endpointPath}${query}`)
          .expect(400, { error: expectedMsg2 });
      });

      const expectedMsg3 = 'lat and lon parameters are invalid';
      it(`responds 400 "${expectedMsg3}" when lat and lon params are invalid`, () => {
        const query = '/?sort=new&lat=string&lon=string';
        return supertest(app)
          .get(`${endpointPath}${query}`)
          .expect(400, { error: expectedMsg3 });
      });

      const expectedMsg4 = 'page parameter is invalid';
      it(`responds 400 "${expectedMsg4}" when page param is invalid`, () => {
        const query = `/?sort=new&lat=${coordinatesGreenwich.lat}&lon=${coordinatesGreenwich.lon}&page=string`;
        return supertest(app)
          .get(`${endpointPath}${query}`)
          .expect(400, { error: expectedMsg4 });
      });

      const expectedMsg5 = 'distance parameter is invalid';
      it(`responds 400 "${expectedMsg5}" when distance param is invalid`, () => {
        const query = `/?sort=new&lat=${coordinatesGreenwich.lat}&lon=${coordinatesGreenwich.lon}&page=1&distance=string`;
        return supertest(app)
          .get(`${endpointPath}${query}`)
          .expect(400, { error: expectedMsg5 });
      });
    });

    context('Given Valid Query Params', () => {
      beforeEach('insert submissions', () =>
        TestHelpers.seedSubmissions(db, mockSubmissions)
      );

      it('responds 200 and an array of submissions within 20km of the queried lat/lon (Greenwich)', () => {
        const query = `/?sort=new&lat=${coordinatesGreenwich.lat}&lon=${coordinatesGreenwich.lon}`;
        return supertest(app)
          .get(`${endpointPath}${query}`)
          .expect(200)
          .then((res) => {
            const [greenwichSubmission] = res.body;
            chai.expect(res.body.length).to.eql(1);
            chai.expect(greenwichSubmission.id).to.eql(1);
          });
      });

      it('responds 200 and an array of submissions within 20km of the queried lat/lon (Quito)', () => {
        const query = `/?sort=new&lat=${coordinatesQuito.lat}&lon=${coordinatesQuito.lon}`;
        return supertest(app)
          .get(`${endpointPath}${query}`)
          .expect(200)
          .then((res) => {
            const [quitoSubmission] = res.body;
            chai.expect(res.body.length).to.eql(1);
            chai.expect(quitoSubmission.id).to.eql(2);
          });
      });

      it('responds 200 and an array of submissions within 20000km of the queried lat/lon (Greenwich)', () => {
        const query = `/?sort=new&lat=${coordinatesGreenwich.lat}&lon=${coordinatesGreenwich.lon}&distance=20000`;
        return supertest(app)
          .get(`${endpointPath}${query}`)
          .expect(200)
          .then((res) => {
            chai.expect(res.body.length).to.eql(2);
          });
      });
    });
  });

  /*****************************************************************
    POST /api/images
  ******************************************************************/
  describe(`POST ${endpointPath}`, () => {
    //
  });

  /*****************************************************************
    PATCH /api/images/:submission_id
  ******************************************************************/
  describe(`PATCH ${endpointPath}/:submission_id`, () => {
    //
  });

  /*****************************************************************
    DELETE /api/images/:submission_id
  ******************************************************************/
  describe(`DELETE ${endpointPath}/:submission_id`, () => {
    //
  });
});
