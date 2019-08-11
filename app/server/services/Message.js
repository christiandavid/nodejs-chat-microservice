const url = require('url');
const axios = require('axios');
const crypto = require('crypto');

class MessageService {
  constructor({ serviceRegistryUrl, serviceVersionId }, circuitBreaker) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionId = serviceVersionId;
    this.circuitBreaker = circuitBreaker;
    this.cache = {};
  }

  async getLastRoomMessages(roomName) {
    const { ip, port } = await this.getService('chat-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/messages/${roomName}`,
    });
  }

  async callService(requestOptions) {
    const parsedUrl = url.parse(requestOptions.url);
    const cacheKey = crypto.createHash('md5').update(requestOptions.method + parsedUrl.path).digest('hex');

    const result = await this.circuitBreaker.callService(requestOptions);

    if (!result) {
      if (this.cache[cacheKey]) {
        return this.cache[cacheKey];
      }
      return null;
    }
    if (requestOptions.method === 'get') {
      this.cache[cacheKey] = result;
    }

    return result;
  }

  async getService(servicename) {
    const svResponse = await axios.get(`${this.serviceRegistryUrl}/get/${servicename}/${this.serviceVersionId}`);
    const response = svResponse.data;
    return response;
  }
}

module.exports = MessageService;
