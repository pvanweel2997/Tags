import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mediumclone',
  password: 'password',
  database: 'mediumclone',
  entities: [__dirname + '/**/*.entity{.ts, .js }'],
  synchronize: true,
};

export default config;
