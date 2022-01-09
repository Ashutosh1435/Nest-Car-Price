import { Report } from '../reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude()
  password: string;
  // Hooks Decorator used for logging
  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id : ', this.id);
  }
  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id : ', this.id);
  }
  @AfterRemove()
  logRemove() {
    console.log('Removed user with id : ', this.id);
  }

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
