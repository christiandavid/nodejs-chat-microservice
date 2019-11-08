const chai = require('chai');
const chaiHttp = require('chai-http');
const helper = require('../../../helper');

const { expect } = chai;
chai.use(chaiHttp);

const { config } = helper;

const app = require('../../../../server/service')(config);

describe('The /users/signin route', () => {
  beforeEach(async () => helper.before());
  afterEach(async () => helper.after());
  it('Should show an error with empty request', async () => {
    const res = await chai.request(app).post('/users/signin');
    // eslint-disable-next-line no-unused-expressions
    expect(res.body.error).to.contain(
      "Cannot read property 'trim' of undefined"
    );
  });

  it('Should show an error with invalid username and password', async () => {
    const res = await chai
      .request(app)
      .post('/users/signin')
      .send({ username: 'christian', password: 'ImBatman' });
    // eslint-disable-next-line no-unused-expressions
    expect(res.body.user.error).to.contain('Invalid username or password');
  });

  it('Should send a json structure after succesful signin', async () => {
    const agent = chai.request.agent(app);
    await helper.createUser(agent, helper.validUser);
    const res = await helper.loginUser(
      agent,
      helper.validUser.username,
      helper.validUser.password
    );
    // eslint-disable-next-line no-unused-expressions
    expect(res.body.user.username).to.equal(helper.validUser.username);
  });
});
