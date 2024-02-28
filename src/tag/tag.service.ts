import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  findAll(): string[] {
    return ['Dragons', 'Basketballs', 'Baloons'];
  }
}
