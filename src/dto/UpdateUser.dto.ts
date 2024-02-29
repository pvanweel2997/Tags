import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  readonly email: string;

  readonly username: string;

  readonly image: string;

  readonly bio: string;
}
