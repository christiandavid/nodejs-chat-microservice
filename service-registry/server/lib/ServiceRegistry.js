const semver = require('semver');

class ServiceRegistry {
  constructor(config) {
    this.log = config.log();
    this.services = {};
    this.timeout = config.serviceTimeout;
  }

  get(name, version) {
    this.cleanup();
    const candidates = Object.values(this.services).filter(
      service =>
        service.name === name &&
        semver.satisfies(service.version, `^${version}`)
    );

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  add(name, version, ip, port) {
    this.cleanup();
    const key = `${name}${version}${ip}${port}`;

    if (!this.services[key]) {
      this.services[key] = {
        name,
        version,
        ip,
        port,
        timestamp: Math.floor(new Date() / 1000),
      };

      this.log.debug(
        `Added service ${name}, version ${version} at ${ip}:${port}`
      );

      return key;
    }
    this.services[key].timestamp = Math.floor(new Date() / 1000);
    this.log.debug(
      `Updated service ${name}, version ${version} at ${ip}:${port}`
    );

    return key;
  }

  remove(name, version, ip, port) {
    const key = `${name}${version}${ip}${port}`;
    delete this.services[key];
    this.log.debug(
      `Removed service ${name}, version ${version} at ${ip}:${port}`
    );

    return key;
  }

  cleanup() {
    const now = Math.floor(new Date() / 1000);
    Object.keys(this.services).forEach(key => {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];
        this.log.debug(`Removed service ${key}`);
      }
    });
  }
}

module.exports = ServiceRegistry;
