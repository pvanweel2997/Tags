import { AuthGuard } from '@app/user/guards/auth.guard';
import { Module } from '@nestjs/common';
import { ProfileControler } from './profile.controller';
import { ProfileService } from '@app/migrations/profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [ProfileControler],
  providers: [AuthGuard, ProfileService],
})
export class ProfileModule {}
