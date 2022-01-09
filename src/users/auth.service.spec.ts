import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    // create fake copy of the users service
    let users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new password with a salted and hashed password', async () => {
    const user = await service.signup('ashutosh@test.com', '1234');

    expect(user.password).not.toEqual('1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  // With the updated Nest versions either can use done() or Async/Await not both at a time.
  it('throws an error if user signs up with email that is in used', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    const promise = service.signup('asdf@asdf.com', 'asdf');
    await expect(promise).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws if signin is called with an unused email', (done) => {
    service.signin('asdf@asdf.com', 'asdf').catch((e) => done());
  });

  it('throws if an invalid password in provided', async () => {
    await service.signup('asdf@asdf.com', 'asdf09988');
    const promise = service.signin('asdf@asdf.com', 'asdf');
    await expect(promise).rejects.toBeInstanceOf(BadRequestException);
  });

  it('return user if correct password is provided', async () => {
    await service.signup('asdf@asdf.com', 'mypassword');
    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
