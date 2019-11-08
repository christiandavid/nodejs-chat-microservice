const axios = require('axios');

class UserService {
  constructor({ serviceRegistryUrl, serviceVersionId }, circuitBreaker) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionId = serviceVersionId;
    this.circuitBreaker = circuitBreaker;
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

  async signin(username, password) {
    const { ip, port } = await this.getService('user-service');
    return this.callService({
      method: 'post',
      url: `http://${ip}:${port}/users/signin`,
      data: {
        username,
        password,
      },
    });
  }

  async signup(username, password) {
    const { ip, port } = await this.getService('user-service');
    return this.callService({
      method: 'post',
      url: `http://${ip}:${port}/users/signup`,
      data: {
        username,
        password,
      },
    });
  }

  async callService(requestOptions) {
    const result = await this.circuitBreaker.callService(requestOptions);

    return result || null;
  }

  async getService(servicename) {
    const svResponse = await axios.get(
      `${this.serviceRegistryUrl}/get/${servicename}/${this.serviceVersionId}`
    );
    const response = svResponse.data;
    return response;
  }
}

module.exports = UserService;
