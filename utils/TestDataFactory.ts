import { faker } from '@faker-js/faker';

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
}

export interface EmployeeData {
  firstName: string;
  lastName: string;
  employeeId: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
}

export class TestDataFactory {
  static generateUserCredentials(role: 'admin' | 'user' = 'user'): UserCredentials {
    return {
      username: role === 'admin' ? 'Admin' : faker.internet.userName(),
      password: role === 'admin' ? 'admin123' : faker.internet.password(),
    };
  }

  static generateUserProfile(): UserProfile {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      employeeId: faker.string.alphanumeric(6).toUpperCase(),
    };
  }

  static generateEmployeeData(): EmployeeData {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      employeeId: faker.string.alphanumeric(6).toUpperCase(),
      jobTitle: faker.person.jobTitle(),
      department: faker.commerce.department(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    };
  }

  static generateRandomString(length: number = 10): string {
    return faker.string.alphanumeric(length);
  }

  static generateRandomEmail(): string {
    return faker.internet.email();
  }

  static generateRandomPhoneNumber(): string {
    return faker.phone.number();
  }

  static generateFutureDate(days: number = 30): string {
    return faker.date.future({ days }).toISOString().split('T')[0];
  }

  static generatePastDate(days: number = 30): string {
    return faker.date.past({ days }).toISOString().split('T')[0];
  }

  static getValidCredentials(): { admin: UserCredentials; user: UserCredentials } {
    return {
      admin: {
        username: process.env.ADMIN_USER || 'Admin',
        password: process.env.ADMIN_PASS || 'admin123',
      },
      user: {
        username: process.env.USER_USER || 'user',
        password: process.env.USER_PASS || 'user123',
      },
    };
  }

  static getInvalidCredentials(): UserCredentials {
    return {
      username: 'invalid_user',
      password: 'invalid_password',
    };
  }
}