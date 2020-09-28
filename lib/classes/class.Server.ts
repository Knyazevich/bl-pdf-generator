import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import path from 'path';
import Logger from './class.Logger';
import ModelPDF from './class.ModelPDF';
import Redis from './class.Redis';

class Server {
  private server: Hapi.Server;

  private readonly INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error';

  private readonly REDIS_KEY_UNDEFINED_MESSAGE = 'Redis key did not provided';

  private readonly SUCCESS_MESSAGE = 'Success';

  private readonly rootPath: string;

  constructor() {
    this.rootPath = path.dirname(require.main.filename);
  }

  public async run() {
    try {
      await this.init();
      await this.setRoutes();
      await this.start();

      Logger.log('good', 'Server started');
    } catch (e) {
      Logger.log('error', `Error while initializing HTTP server on the high level method: ${e}`);
    }
  }

  private async init() {
    this.server = await Hapi.server({
      port: process.env.PORT,
      host: process.env.HOST,
      router: {
        stripTrailingSlash: true,
      },
    });
  }

  private async setRoutes() {
    await this.server.register(Inert);

    await this.server.route([
      {
        method: 'POST',
        path: '/modelPDF',
        handler: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {
          try {
            const pdf = new ModelPDF();
            const buffer = await pdf.generate(req.payload);

            return h.response(buffer)
              .type('application/pdf')
              .encoding('utf8')
              .header('Content-Disposition', 'attachment;filename=model.pdf');
          } catch (e) {
            Logger.log('error', `Error in the POST /modelPDF route: ${e}`);
          }
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
      {
        method: 'GET',
        path: '/redis/{key*}',
        handler: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {
          try {
            const { key } = req.params;

            if (!key) {
              return h
                .response({
                  statusCode: 400,
                  error: this.REDIS_KEY_UNDEFINED_MESSAGE,
                  message: this.REDIS_KEY_UNDEFINED_MESSAGE,
                })
                .code(400);
            }

            const response = await Redis.getAsync()(key);

            if (response || response === null) {
              return h
                .response({
                  statusCode: 200,
                  message: this.SUCCESS_MESSAGE,
                  data: response,
                });
            }

            return h
              .response({
                statusCode: 500,
                error: this.INTERNAL_SERVER_ERROR_MESSAGE,
                message: this.INTERNAL_SERVER_ERROR_MESSAGE,
              })
              .code(500);
          } catch (e) {
            Logger.log('error', `Error in the GET /redis/{key*} route: ${e}`);
          }
        },
      },
      {
        method: 'POST',
        path: '/redis/{key*}',
        handler: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {
          try {
            const { key } = req.params;

            // @ts-ignore
            const value = req.payload.value;

            if (!key) {
              return h
                .response({
                  statusCode: 400,
                  error: this.REDIS_KEY_UNDEFINED_MESSAGE,
                  message: this.REDIS_KEY_UNDEFINED_MESSAGE,
                })
                .code(400);
            }

            const response = await Redis.setAsync()(key, JSON.stringify(value), 'EX', Redis.ONE_DAY_AS_MILLISECONDS);

            if (response === 'OK') {
              return h
                .response({
                  statusCode: 200,
                  message: this.SUCCESS_MESSAGE,
                });
            }

            return h
              .response({
                statusCode: 500,
                error: this.INTERNAL_SERVER_ERROR_MESSAGE,
                message: this.INTERNAL_SERVER_ERROR_MESSAGE,
              })
              .code(500);
          } catch (e) {
            Logger.log('error', `Error in the POST /redis/{key*} route: ${e}`);
          }
        },
      },
    ]);
  }

  private async start() {
    try {
      await this.server.register({
        plugin: require('hapi-cors'), // eslint-disable-line
      });

      await this.server.start();
    } catch (e) {
      Logger.log('error', `Error while starting HTTP server: ${e}`);
    }
  }
}

export default Server;
