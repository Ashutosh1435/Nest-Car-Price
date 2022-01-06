import { Expose, Exclude } from 'class-transformer';
// Both  are opp to each other
export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
  @Expose()
  password: string;
}
