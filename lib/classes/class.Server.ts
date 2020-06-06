import Hapi from '@hapi/hapi';
import Logger from './class.Logger';

class Server {
  private server: Hapi.Server;

  public async run() {
    const l = new Logger();

    try {
      await this.init();
      await this.setRoutes();
      await this.start();

      l.log('good', 'Server started');
    } catch (e) {
      l.log('error', e);
    }
  }

  private async init() {
    this.server = await Hapi.server({
      port: process.env.PORT,
      host: process.env.HOST,
    });
  }

  private async setRoutes() {
    await this.server.route([
      {
        method: 'GET',
        path: '/modelPDF/',
        handler(req: Hapi.Request) {
          return JSON.stringify(req.query);
        },
      },
    ]);
  }

  private async start() {
    await this.server.register({
      plugin: require('hapi-cors'), // eslint-disable-line
      options: {
        origins: [process.env.ALLOWED_HOST],
      },
    });

    await this.server.start();
  }
}

export default Server;
