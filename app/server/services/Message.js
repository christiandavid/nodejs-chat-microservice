const axios = require('axios');

class MessageService {
  constructor({ serviceRegistryUrl, serviceVersionId }) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionId = serviceVersionId;
  }

  async getLastRoomMessages(roomName) {
    const { ip, port } = await this.getService('chat-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/messages/${roomName}`,
    });
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
    const svResponse = await axios.get(`${this.serviceRegistryUrl}/get/${servicename}/${this.serviceVersionId}`);
    const response = svResponse.data;
    return response;
  }
}

module.exports = MessageService;
