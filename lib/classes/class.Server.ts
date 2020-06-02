import Hapi from '@hapi/hapi';
import Logger from './class.Logger';

class Server {
  private server: Hapi.Server;

  public run() {
    const l = new Logger();

    try {
      this.init();
      this.setRoutes();
      this.start();

      l.log('good', 'Server started');
    } catch (e) {
      l.log('error', e);
    }
  }

  private init() {
    this.server = Hapi.server({
      port: process.env.PORT,
      host: process.env.HOST,
    });
  }

  private setRoutes() {
    this.server.route([
      {
        method: 'GET',
        path: '/modelPDF/{id}',
        handler(req: Hapi.Request) {
          return req.params.id;
        },
      },
    ]);
  }

  private start() {
    this.server.start();
  }
}

export default Server;
