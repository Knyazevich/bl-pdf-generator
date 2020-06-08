import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import path from 'path';
import Logger from './class.Logger';
import ModelPDF from './class.ModelPDF';

class Server {
  private server: Hapi.Server;

  private readonly rootPath: string;

  constructor() {
    this.rootPath = path.dirname(require.main.filename);
  }

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
    await this.server.register(Inert);

    await this.server.route([
      {
        method: 'GET',
        path: '/modelPDF',
        handler: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {
          const pdf = new ModelPDF();
          const buffer = await pdf.generate(req.query);

          return h.response(buffer)
            .type('application/pdf')
            .encoding('utf8')
            .header('Content-Disposition', 'attachment;filename=model.pdf');
        },
      },
      {
        method: 'GET',
        path: '/public/{file*}',
        handler: {
          directory: {
            path: path.normalize(`${this.rootPath}/templates/`),
            listing: true,
          },
        },
      },
    ]);
  }

  private async start() {
    await this.server.register({
      plugin: require('hapi-cors'), // eslint-disable-line
    });

    await this.server.start();
  }
}

export default Server;
