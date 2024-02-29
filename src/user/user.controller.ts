import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/dto/CreateUser.dto';
import { UserResponseInterface } from '@app/types/userResponse.interface';
import { LoginUserDto } from '@app/dto/LoginUser.dto';
import { ExpressRequest } from '@app/types/expressRequest.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes()
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  async currentUser(
    @Req() request: ExpressRequest,
  ): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(request.user);
  }
}
