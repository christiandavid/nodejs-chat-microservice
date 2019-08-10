const axios = require('axios');

class ChatService {
  constructor({ serviceRegistryUrl, serviceVersionId }) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionId = serviceVersionId;
  }

  async getChatUrl() {
    const { ip, port } = await this.getService('chat-service');
    return `http://${ip}:${port}/nsp`;
  }

  // eslint-disable-next-line class-methods-use-this
  async callService(requestOptions) {
    try {
      const response = await axios(requestOptions);
      return response.data;
    } catch (err) {
      return false;
    }
  }

  async getService(servicename) {
    const response = await axios.get(`${this.serviceRegistryUrl}/get/${servicename}/${this.serviceVersionId}`);
    return response.data;
  }
}

module.exports = ChatService;
