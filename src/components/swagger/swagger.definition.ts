import config from '../../config/config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express App Backend',
    version: '0.0.1',
    description: 'This is a boilerplate for an Express App Backend',
    license: {
      name: '',
      url: '',
    },
  },
  servers: [
    {
      url: `https://localhost:${config.port}/api`,
      description: 'Development Server',
    },
    {
      url: `http://localhost:${config.port + 1}/api`,
      description: 'Development Server',
    },
    {
      url: `http://localhost:${config.port}/api`,
      description: 'Development Server 2',
    },
    {
      url: `https://64.226.86.231:8002/api`,
      description: 'Staging secure Server',
    },
    {
      url: `http://64.226.86.231:8001/api`,
      description: 'Staging Server',
    },
  ],
};

export default swaggerDefinition;
