import { EmployeeController } from '@/controllers/employee.controller';
import { Router } from 'express';

export class EmployeeRouter {
  private router: Router;
  private employeeController: EmployeeController;

  constructor() {
    this.employeeController = new EmployeeController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.employeeController.getEmployees);
    this.router.post('/', this.employeeController.postEmployee);
    this.router.patch('/', this.employeeController.patchEmployees);
  }

  getRouter(): Router {
    return this.router;
  }
}
