import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '@app/user/user.entity';
import { FollowEntity } from '@app/profile/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity]),
  ],
  controllers: [ArticleController],
  providers: [AuthGuard, ArticleService],
})
export class ArticleModule {}
