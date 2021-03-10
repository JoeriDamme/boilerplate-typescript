import express, { Request, Response, Router, NextFunction } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import AppError from '@lib/app-error';
import sendError from '@helpers/error-handling';
import logger from '@lib/logger';
import statusRoutes from '@routes/status-routes';
import docRoutes from '@routes/docs-routes';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import httpContext from 'express-http-context';
import uniqid from 'uniqid';

const log = logger.child({ method: 'app' });

interface ApplicationRouter {
  handler: Router;
  middleware: any[];
  path: string;
}

export default class App {
  private app: express.Application;

  constructor() {
    this.app = express();

    this.setExpressConfiguration();
    this.setRoutes();
  }

  /**
   * Start the Express HTTP server.
   */
  public start(): http.Server {
    log.debug('Starting HTTP server');
    return http.createServer(this.app);
  }

  /**
   * Set routes.
   */
  private setRoutes(): void {
    log.debug('Setup express routes...');
    const routes: ApplicationRouter[] = [
      {
        handler: statusRoutes,
        middleware: [],
        path: '/status',
      },
      {
        handler: docRoutes,
        middleware: [],
        path: '/docs',
      },
    ];

    routes.forEach((route: ApplicationRouter) => this.app.use(route.path, route.middleware, route.handler));

    this.app.use((request: Request, response: Response, next: NextFunction) => {
      const error = new AppError('Endpoint not found', 404);
      return next(error);
    });

    // Can't remove the unsused var here, otherwise this custom error handler will be skipped.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((error: AppError, request: Request, response: Response, next: NextFunction) => sendError(error, request, response));
  }

  private setExpressConfiguration(): void {
    log.debug('Loading express configuration...');

    // Disable the response header 'x-powered-by'.
    this.app.set('x-powered-by', false);  

    // Load the httpContect middleware, so we can store an unique id for logging.
    this.app.use(httpContext.middleware);
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      httpContext.set('requestId', uniqid());
      return next();
    });

    // Enable logging.
    this.app.use(morgan('common', { stream: { write: message => log.info(message) }}));

    // Enable cors.
    this.app.use(cors());

    // Load the swagger documentation at /docs.
    this.app.use('/docs', swaggerUi.serve);

    // Enable the body parser.
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }
}
