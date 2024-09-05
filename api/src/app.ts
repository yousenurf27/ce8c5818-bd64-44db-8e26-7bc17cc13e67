import express, {
  Express,
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { EmployeeRouter } from './routers/employee.router';
import { ResponseError } from './error/response-error';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (!req.path.includes('/api/')) {
        res.status(404).send('Not found url API !');
      } else {
        next();
      }
    });

    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ResponseError) {
          res.status(err.status).send({
            error: err.message,
          });
        } else {
          res.status(500).send({
            error: err.message,
          });
        }
      }
    );
  }

  private routes(): void {
    const employeeRouter = new EmployeeRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send('Hello, Antusius API!');
    });

    this.app.use('/api/employee', employeeRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(` ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
