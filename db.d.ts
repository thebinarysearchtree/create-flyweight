interface QueryOptions {
  parse: boolean;
}

interface DatabaseOptions {
  debug?: boolean;
}

interface SQLiteOptions extends DatabaseOptions {
  db: string | URL;
  sql: string | URL;
  tables: string | URL;
  views: string | URL;
  types: string | URL;
  migrations: string | URL;
  extensions?: string | URL | Array<string | URL>;
  adaptor: any;
}

interface FileSystem {
  readFile: (path: string, encoding: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  readdir: (path: string) => Promise<string[]>;
  join: (...paths: string[]) => string;
  readSql: (path: string) => Promise<string>;
}

interface Paths {
  tables: string;
  views: string;
  sql: string;
  types: string;
  migrations: string;
  wrangler?: string;
  files?: string;
}

declare class Database {
  constructor(options: DatabaseOptions);
  runMigration(sql: string): Promise<void>;
  makeTypes(fileSystem: FileSystem, paths: Paths): Promise<void>;
  getClient(): TypedDb; 
  getTables(): Promise<string>;
  createMigration(fileSystem: FileSystem, paths: Paths, name: string, reset?: boolean): Promise<string>;
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  run(args: { query: any, params?: any }): Promise<number>;
  all<T>(args: { query: any, params?: any, options?: QueryOptions }): Promise<Array<T>>;
  exec(query: string): Promise<void>;
}

declare class SQLiteDatabase extends Database {
  constructor(options: SQLiteOptions);
  close(): Promise<void>;
}

interface Keywords<T> {
  select: T;
  orderBy?: Array<string> | string;
  desc?: boolean;
  limit?: number;
  offset?: number;
  distinct?: boolean;
}

interface KeywordsWithExclude<T> {
  exclude: T;
  orderBy?: Array<string> | string;
  desc?: boolean;
  limit?: number;
  offset?: number;
  distinct?: boolean;
}

interface KeywordsWithoutSelect {
  orderBy?: Array<string> | string;
  desc?: boolean;
  limit?: number;
  offset?: number;
  distinct?: boolean;
}

interface SingularQueries<T, I, W, R> {
  [key: string]: any;
  insert(params: I): Promise<R>;
  update(query: W | null, params: Partial<T>): Promise<number>;
  get(params?: W | null): Promise<T | undefined>;
  get<K extends keyof T>(params: W | null, columns: K[]): Promise<Pick<T, K> | undefined>;
  get<K extends keyof T>(params: W | null, column: K): Promise<T[K] | undefined>;
  get(params: W | null, keywords: KeywordsWithoutSelect): Promise<T | undefined>;
  get<K extends keyof T>(params: W | null, keywords: Keywords<K>): Promise<T[K] | undefined>;
  get<K extends keyof T>(params: W | null, keywords: Keywords<K[]>): Promise<Pick<T, K> | undefined>;
  get<K extends keyof T>(params: W | null, keywords: KeywordsWithExclude<K[]>): Promise<Omit<T, K> | undefined>;
  exists(params: W | null): Promise<boolean>;
  remove(params?: W): Promise<number>;
}

interface MultipleQueries<T, I, W> {
  [key: string]: any;
  insert(params: Array<I>): Promise<void>;
  update(query: W | null, params: Partial<T>): Promise<number>;
  get(params?: W): Promise<Array<T>>;
  get<K extends keyof T>(params: W | null, columns: K[]): Promise<Array<Pick<T, K>>>;
  get<K extends keyof T>(params: W | null, column: K): Promise<Array<T[K]>>;
  get(params: W | null, keywords: KeywordsWithoutSelect): Promise<Array<T>>;
  get<K extends keyof T>(params: W | null, keywords: Keywords<K>): Promise<Array<T[K]>>;
  get<K extends keyof T>(params: W | null, keywords: Keywords<K[]>): Promise<Array<Pick<T, K>>>;
  get<K extends keyof T>(params: W | null, keywords: KeywordsWithExclude<K[]>): Promise<Array<Omit<T, K>>>;
  count(params: W | null, keywords?: { distinct: true }): Promise<number>;
  remove(params?: W): Promise<number>;
}

interface User {
  id: number;
  name: string;
}

interface InsertUser {
  id?: number;
  name: string;
}

interface WhereUser {
  id?: number | Array<number>;
  name?: string | Array<string> | RegExp;
}

interface UsersTest {
  id: number;
  name: string;
}

interface UsersQueries {
  test(): Promise<Array<UsersTest>>;
}

interface UserQueries {
  test(): Promise<UsersTest | undefined>;
}

interface TypedDb {
  [key: string]: any,
  users: MultipleQueries<User, InsertUser, WhereUser> & UsersQueries,
  user: SingularQueries<User, InsertUser, WhereUser, number> & UserQueries,
  begin(): Promise<void>,
  commit(): Promise<void>,
  rollback(): Promise<void>,
  getTransaction(): Promise<TypedDb>,
  release(transaction: TypedDb): void
}

declare const database: SQLiteDatabase;
declare const db: TypedDb;
export {
  database,
  db
}
