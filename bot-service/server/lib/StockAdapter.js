/* eslint-disable class-methods-use-this */
class StockAdapter {
  constructor(message) {
    this.message = message;
    this.regex = /\/stock=(.*?)($|\s)/;
  }

  verify() {
    return this.regex.test(this.message);
  }

  getUrl() {
    if (this.verify()) {
      const found = this.message.match(this.regex);
      return `https://stooq.com/q/l/?s=${found[1]}&f=sd2t2ohlcv&h&e=csv`;
    }

    return false;
  }
}

module.exports = StockAdapter;
