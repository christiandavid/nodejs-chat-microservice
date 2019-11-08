# Node.JS Challenge

This project has been developed with a Microservices architecture, all mandatory features are inside the app as well as all **Bonus task**

## Microservices

All Microservices communicate via **service-registry**, **Redis** and **RabbitMQ**

* app
* service-registry
* user-service
* bot-service
* chat-service

### Prerequisites

For the execution of this project it is necessary to have Docker installed, and share the folder where the project is in the Docker configuration.

[Docker for Mac](https://docs.docker.com/docker-for-mac/install/)

[Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

### Installing

After having installed docker we proceed to issue the following command:

```
cd folder_project
docker-compose up -d mongo rabbitmq redis serviceregistry userservice botservice chatservice app
```

> **Note:** It is important to wait 5 minutes for all Services to be up

### Running

Load [localhost](http://localhost:3000/)

## Authors

* **Christian David Ibarguen R**