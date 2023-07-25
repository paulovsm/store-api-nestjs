import 'dotenv/config';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    migrations: [__dirname + '/migrations/*.{js,ts}'],
});

// Command to run migrations:
// npm run typeorm -- migration:show -d src/db/data-source-cli.ts