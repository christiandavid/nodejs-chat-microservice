const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);
const helper = require('../../../helper');

const { config, UserModel } = helper;

const app = require('../../../../server/service')(config);

describe('The /users/signup route', () => {
  beforeEach(async () => helper.before());
  afterEach(async () => helper.after());
  it('Should show an error with empty request', async () => {
    const res = await chai.request(app).post('/users/signup');
    expect(res.body.error).to.contain(
      "Cannot read property 'trim' of undefined"
    );
  });
  it('Should send a json structure after succesful signin', async () => {
    const agent = chai.request.agent(app);
    const res = await agent
      .post('/users/signup')
      .set('content-type', 'application/json')
      .send(helper.validUser);
    expect(res.status).to.equal(200);
    expect(res.body.singup).to.equal(true);
    const user = await UserModel.findOne({
      username: helper.validUser.username,
    });
    expect(user).to.be.instanceOf(UserModel);
  });
});
