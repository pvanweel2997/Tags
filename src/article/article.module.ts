import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { ArticleService } from './article.service';

@Module({
  controllers: [ArticleController],
  providers: [AuthGuard, ArticleService],
})
export class ArticleModule {}
