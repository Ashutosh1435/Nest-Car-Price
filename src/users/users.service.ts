import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    // We're first creating one instance of User Entity
    // Then After that saving it, bec in some cases there might be
    // possible to have some validation at time of creating entity
    // So to make sure that's not get skipped We do so.
    // However we candirectly pass the user inside Save()as well.
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }
  find(email: string) {
    return this.repo.find({ email });
  }
  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne(id);
  }
  async update(id: number, attrs: Partial<User>) {
    // In this way our Entity Hooks will be called
    // But If we will directly use update() They will not call.
    // Bec that will directly make chng in the database.
    const user = await this.repo.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
  async remove(id: number) {
    // In this way our Entity Hooks will be called
    // But If we will directly use delete() They will not call.
    // Bec that will directly make chng in the database.
    const user = await this.repo.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.repo.remove(user);
  }
}
