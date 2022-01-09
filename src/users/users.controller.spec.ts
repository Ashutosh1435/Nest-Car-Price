import { UsersController } from './users.controller';
import { BadRequestException, Controller } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  beforeEach(async () => {
    // create fake copy of the users & auth services
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'ashutosh@test.com',
          password: '12345',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: '12345' } as User]);
      },
      // update: () => {},
      // remove: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findAllUsers returns the list of users with given email', async () => {
    const users = await controller.getUser('ashutosh@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('ashutosh@test.com');
  });
  it('findOne returns the user with given id', async () => {
    const user = await controller.getUsers('1');
    expect(user).toBeDefined();
    expect(user.email).toEqual('ashutosh@test.com');
  });
  // it('signn updates session object and returns user', async () => {
  //   const session = { userId: -15 };
  //   const user = await controller.signIn(
  //     { email: 'asdf@asdf.com', password: 'asdf' },
  //     session,
  //   );

  //   expect(user.id).toEqual(1);
  //   expect(session.userId).toEqual(1);
  // });
});
