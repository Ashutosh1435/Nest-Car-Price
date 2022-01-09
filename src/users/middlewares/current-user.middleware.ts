import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

// Go and find the Express Library find the Interface called
// Request and add the currentUser which is optional
// Whose value can be an instance of User Entity
declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleWare implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const currentUser = await this.usersService.findOne(userId);
      req.currentUser = currentUser;
    }
    next();
  }
}
