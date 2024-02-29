import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArticleController],
  providers: [AuthGuard, ArticleService],
})
export class ArticleModule {}
