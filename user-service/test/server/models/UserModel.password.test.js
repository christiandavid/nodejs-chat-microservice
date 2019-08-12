/* eslint-disable import/no-extraneous-dependencies */
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

  it('Should store the password encrypted', async () => {
    const user = new UserModel(helper.validUser);
    await user.save();
    const foundUser = await UserModel.findOne({ username: helper.validUser.username }).exec();
    expect(foundUser.password).to.exist;
    expect(foundUser.password).to.not.equal(helper.validUser.password);
  });

  it('Should be able to correctly validate a password', async () => {
    const user = new UserModel(helper.validUser);
    await user.save();
    const foundUser = await UserModel.findOne({ username: helper.validUser.username }).exec();
    expect(foundUser).to.be.not.null;
    expect(foundUser.password).to.exist;
    const compResInvalid = await foundUser.comparePassword('ImBatman');
    expect(compResInvalid).to.be.false;
    const compresValid = await foundUser.comparePassword(helper.validUser.password);
    expect(compresValid).to.be.true;
  });
});
