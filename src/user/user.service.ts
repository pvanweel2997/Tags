import { CreateUserDto } from '@app/dto/CreateUser.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async createUser(createDto: CreateUserDto) {
    return createDto;
  }
}
