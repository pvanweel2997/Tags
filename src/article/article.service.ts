import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  async createArticle(createArticleDto: any) {
    console.log('=== createArticleDto', createArticleDto);
    return createArticleDto;
  }
}
