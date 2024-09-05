import { AddEmployeeReq, UpdateEmployeeReq } from '@/models/employee.model';
import { EmployeeService } from '@/services/employee.service';
import { NextFunction, Request, Response } from 'express';

export class EmployeeController {
  async getEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const employees = await EmployeeService.getEmployees();

      return res.status(200).send({
        data: employees,
      });
    } catch (e) {
      next(e);
    }
  }

  async postEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as AddEmployeeReq;

      await EmployeeService.verifyEmployeeByEmail(request.email);

      const employee = await EmployeeService.addEmployee(request);

      return res.status(201).send({
        data: employee,
      });
    } catch (e) {
      next(e);
    }
  }

  async patchEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as UpdateEmployeeReq[];

      await Promise.race(
        request.map(async (data) => {
          await EmployeeService.verifyEmployeeById(data.id);
        })
      );

      const employees = await EmployeeService.updateEmployees(request);

      return res.status(201).send({
        data: employees,
      });
    } catch (e) {
      next(e);
    }
  }
}
