import { Body, Controller, Post } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Post()
  async createArticle(@Body('article') article: any) {
    console.log('=== article', article);
    return await this.articleService.createArticle(article);
    // return 'create article';
  }
}
