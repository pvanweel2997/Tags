import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, getRepository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { UserService } from '@app/user/user.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    if (query.tag) {
      queryBuilder.andWhere('articles.taglist LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.author,
        },
      });
      let id = -1;
      if (author) {
        id = author.id;
      }

      queryBuilder.andWhere('articles.authorId = :author', {
        author: id,
      });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.favorited,
        },
        relations: ['favorites'],
      });
      const ids = author.favorites.map((favorite) => favorite.id);
      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    queryBuilder.orderBy('articles.createdat', 'DESC');
    const articlesCount = await queryBuilder.getCount();
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];
    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: {
          id: currentUserId,
        },
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorited = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });

    return { articles: articlesWithFavorited, articlesCount };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!article.taglist) {
      article.taglist = [];
    }
    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;
    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOneBy({
      slug,
    });
    if (!article) {
      throw new HttpException(
        'No article found for slug',
        HttpStatus.NOT_FOUND,
      );
    }
    return article;
  }

  async deleteBySlug(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException(
        'No article found for slug',
        HttpStatus.NOT_FOUND,
      );
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not the author', HttpStatus.FORBIDDEN);
    }
    return this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    currentUserId: number,
    updateArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You cannot update others articles',
        HttpStatus.FORBIDDEN,
      );
    }
    Object.assign(article, updateArticleDto);
    return this.articleRepository.save(article);
  }

  async addArticleToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      relations: ['favorites'],
    });
    const isNotFavorited =
      user.favorites.findIndex(
        (articlesInFavorites) => articlesInFavorites.id === article.id,
      ) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritescount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  async deleteArticleToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      relations: ['favorites'],
    });
    const articleIndex = user.favorites.findIndex(
      (articlesInFavorites) => articlesInFavorites.id === article.id,
    );

    if (articleIndex >= 0) {
      delete user.favorites[articleIndex];
      article.favoritescount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
