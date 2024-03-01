import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import { ArticleEntity } from '@app/article/article.entity';
import { DeleteResult } from 'typeorm';
import { ArticlesResponseInterface } from '@app/article/types/articlesResponse.interface';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';

@Controller('articles')
@UseGuards(AuthGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.getFeed(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async createArticle(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDTO: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDTO,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  @UseGuards(AuthGuard)
  async getArticleBySlug(@Param('slug') slug: string) {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteBySlug(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
  ): Promise<DeleteResult> {
    return await this.articleService.deleteBySlug(slug, currentUserId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
    @Body('article') updateArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(
      slug,
      currentUserId,
      updateArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.deleteArticleToFavorites(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
