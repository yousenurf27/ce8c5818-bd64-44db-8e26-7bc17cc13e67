import { ResponseError } from '@/error/response-error';
import { AddEmployeeReq, UpdateEmployeeReq } from '@/models/employee.model';
import prisma from '@/prisma';

export class EmployeeService {
  static async getEmployees() {
    const employees = await prisma.employee.findMany();

    return employees;
  }

  static async addEmployee(req: AddEmployeeReq) {
    const employee = await prisma.employee.create({
      data: req,
    });

    return employee;
  }

  static async updateEmployees(req: UpdateEmployeeReq[]) {
    const employees = await Promise.all(
      req.map(async (data) => {
        const { firstName, lastName, position, phone, email } = data;
        return await prisma.employee.update({
          where: {
            id: data.id,
          },
          data: {
            firstName,
            lastName,
            position,
            phone,
            email,
          },
        });
      })
    );

    return employees;
  }

  static async verifyEmployeeByEmail(email: string) {
    const employee = await prisma.employee.findUnique({
      where: {
        email: email,
      },
    });

    if (employee) {
      throw new ResponseError(400, `Email already exist!`);
    }
  }

  static async verifyEmployeeById(id: number) {
    const employee = await prisma.employee.findUnique({
      where: {
        id: id,
      },
    });

    if (!employee) {
      throw new ResponseError(404, `User with id ${id} not found!`);
    }
  }
}
