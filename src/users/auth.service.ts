import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email already exists
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email already in use');
    }
    // Hash the password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 16)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');
    // Create a new user
    const user = await this.usersService.create(email, hashedPassword);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new BadRequestException('User Not Found');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 16)) as Buffer;
    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('wrong password');
    }
    return user;
  }
}
