interface QueryOptions {
  parse: boolean;
}

interface DatabaseConfig {
  debug?: boolean;
}

interface TursoConfig extends DatabaseConfig {
  db: any;
  files: any;
}

type Unwrap<T extends any[]> = {
  [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K];
};

declare class Database {
  constructor(options: DatabaseConfig);
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

declare class TursoDatabase extends Database {
  constructor(options: TursoConfig);
  batch(handler: (batcher: any) => any[]): Promise<any[]>;
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

interface TypedDb {
  [key: string]: any,
  users: MultipleQueries<User, InsertUser, WhereUser>,
  user: SingularQueries<User, InsertUser, WhereUser, number>,
  begin(): Promise<void>,
  commit(): Promise<void>,
  rollback(): Promise<void>,
  getTransaction(type: ('read' | 'write')): Promise<TypedDb>,
  batch:<T extends any[]> (batcher: (bx: TypedDb) => T) => Promise<Unwrap<T>>
}

interface Config {
    url: string;
    authToken?: string;
    encryptionKey?: string;
    syncUrl?: string;
    syncInterval?: number;
    tls?: boolean;
    intMode?: IntMode;
    fetch?: Function;
    concurrency?: number | undefined;
}

declare function makeClient(options: Config): TypedDb;

export default makeClient;
