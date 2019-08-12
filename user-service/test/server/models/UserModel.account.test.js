/* eslint-disable no-unused-expressions */
const chai = require('chai');
chai.use(require('chai-as-promised'));
const helper = require('../../helper');

const { UserModel } = helper;
const { expect } = chai;

describe('The User DB Schema', async () => {
  beforeEach(async () => helper.before());
  afterEach(async () => helper.after());

  it('Should let you create a new user with valid data', async () => {
    const user = new UserModel(helper.validUser);
    const savedUser = await user.save();
    expect(savedUser.id).to.exist;
  });

  it('Should reject a too short username', async () => {
    const user = new UserModel({ username: 'ab', password: 'abcdef' });
    await expect(user.save()).to.be.rejectedWith(Error);
  });

  it('Should reject a too short password', async () => {
    const user = new UserModel({ username: 'ab', password: 'abc' });
    await expect(user.save()).to.be.rejectedWith(Error);
  });

  it('Should find a user', async () => {
    const user = new UserModel(helper.validUser);
    await user.save();
    const foundUser = await UserModel.findOne({ username: helper.validUser.username }).exec();
    expect(foundUser.username).to.equal('christian');
  });
});
