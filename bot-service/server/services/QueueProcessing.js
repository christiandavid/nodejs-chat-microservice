const axios = require('axios');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const csv = require('csv-parser');
const StockAdapter = require('../lib/StockAdapter');

/* eslint-disable class-methods-use-this */
class QueueProcessing {
  constructor({ log }) {
    this.log = log();
    this.filename = '';
  }

  processQueue(message) {
    const stockAdapter = new StockAdapter(message);
    const url = stockAdapter.getUrl();
    this.log.debug(`Url: ${url}, message ${message}`);

    return new Promise(resolve => {
      if (url !== false) {
        this.getData(url).then(data => {
          if (data !== false) {
            const values = data[0];
            resolve(
              values.Date !== 'N/D' && values.Time !== 'N/D' ? values : 404
            );
          }
        });
      } else {
        resolve("Sorry, i can't understand the command");
      }
    });
  }

  getData(url) {
    return this.downloadCSV(url)
      .then(response => {
        if (response && this.filename) {
          return this.readCSV();
        }
        return false;
      })
      .then(data => data)
      .catch(err => {
        this.log.fatal('getData: ', err);
        return false;
      });
  }

  downloadCSV(url) {
    // Download CSV
    return axios({
      url,
      method: 'GET',
      responseType: 'blob',
      timeout: 10000,
    })
      .then(response => {
        // Write CSV on tmp folder
        this.filename = `/tmp/${uuidv4()}.csv`;

        fs.writeFileSync(this.filename, response.data);
        this.log.info(`Downloaded CSV file: ${this.filename}`);

        return true;
      })
      .catch(err => {
        this.log.fatal('downloadCSV: ', err);
        return false;
      });
  }

  readCSV() {
    return this.readStream(this.filename)
      .then(data => data)
      .catch(err => {
        this.log.fatal('readCSV: ', err);
        return err;
      })
      .finally(() => {
        // Delete CSV File
        fs.unlink(this.filename, err => {
          if (err) throw err;
        });
      });
  }

  readStream() {
    const stream = fs.createReadStream(this.filename).pipe(csv());

    return new Promise((resolve, reject) => {
      const data = [];

      stream.on('data', chunk => data.push(chunk));
      stream.on('end', () => resolve(data));
      stream.on('error', error => reject(error));
    });
  }
}

module.exports = QueueProcessing;
