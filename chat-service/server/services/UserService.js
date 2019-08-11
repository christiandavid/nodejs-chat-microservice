/* eslint-disable class-methods-use-this */
const axios = require('axios');

class UserService {
  constructor({ serviceRegistryUrl, serviceVersionId }) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionId = serviceVersionId;
  }

  async findById(userId) {
    const { ip, port } = await this.getService('user-service');
    return this.callService({
      method: 'post',
      url: `http://${ip}:${port}/users/findById`,
      data: {
        userId,
      },
    });
  }

  async callService(requestOptions) {
    const response = await axios(requestOptions);
    return response.data || null;
  }

  async getService(servicename) {
    const svResponse = await axios.get(`${this.serviceRegistryUrl}/get/${servicename}/${this.serviceVersionId}`);
    const response = svResponse.data;
    return response;
  }
}

module.exports = UserService;
