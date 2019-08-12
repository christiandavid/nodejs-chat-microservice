/* eslint-disable no-unused-expressions */
const chai = require('chai');

const mongoose = require('mongoose');

const { expect } = chai;
const configDev = require('../../config').development;
const configProd = require('../../config').production;
const configTest = require('../../config').test;

describe('The DB', () => {
  it('Should be configured for development', async () => {
    expect(configDev.db.dsn).to.be.a('string');
  });
  it('Should be configured for production', async () => {
    expect(configProd.db.dsn).to.be.a('string');
  });
  it('Should be configured for testing', async () => {
    expect(configTest.db.dsn).to.be.a('string');
  });

  it('Development should be reachable', async () => {
    const db = await mongoose.connect(configDev.db.dsn, {
      useCreateIndex: true,
      useNewUrlParser: true,
    });
    expect(db).to.not.be.null;
    await db.connection.close();
  });
  it('Test should be reachable', async () => {
    const db = await mongoose.connect(configTest.db.dsn, {
      useCreateIndex: true,
      useNewUrlParser: true,
    });
    expect(db).to.not.be.null;
    await db.connection.close();
  });
  it('Production should be reachable', async () => {
    const db = await mongoose.connect(configProd.db.dsn, {
      useCreateIndex: true,
      useNewUrlParser: true,
    });
    expect(db).to.not.be.null;
    await db.connection.close();
  });
});
