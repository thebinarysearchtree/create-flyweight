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

interface D1Config extends DatabaseOptions {
  db: any;
  files: any;
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
}

declare class Database {
  constructor(options: DatabaseOptions);
  runMigration(sql: string): Promise<void>;
  makeTypes(fileSystem: FileSystem, paths: Paths): Promise<void>;
  getClient(): TypedDb; 
  getTables(): Promise<string>;
  createMigration(fileSystem: FileSystem, paths: Paths, name: string): Promise<string>;
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

declare class D1Database extends Database {
  constructor(options: D1Config);
  batch(handler: (batcher: any) => any[]): Promise<any[]>;
}

declare class Modifier {
  constructor(name: string, value: any, operator: string);
  name: string;
  value: any;
  operator: string
}

declare function not(value: any): Modifier | undefined;
declare function gt(value: any): Modifier | undefined;
declare function gte(value: any): Modifier | undefined;
declare function lt(value: any): Modifier | undefined;
declare function lte(value: any): Modifier | undefined;
declare function like(value: any): Modifier | undefined;
declare function match(value: any): Modifier | undefined;
declare function glob(value: any): Modifier | undefined;

type Unwrap<T extends any[]> = {
  [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K];
};



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

interface VirtualKeywordsSelect<T, K> {
  select: K;
  rank?: true;
  bm25?: Record<keyof Omit<T, "rowid">, number>;
  limit?: number;
  offset?: number;
}

interface VirtualKeywordsHighlight<T> {
  rank?: true;
  bm25?: Record<keyof Omit<T, "rowid">, number>;
  highlight: { column: keyof T, tags: [string, string] };
  limit?: number;
  offset?: number;
}

interface VirtualKeywordsSnippet<T> {
  rank?: true;
  bm25?: Record<keyof Omit<T, "rowid">, number>;
  snippet: { column: keyof T, tags: [string, string], trailing: string, tokens: number };
  limit?: number;
  offset?: number;
}

interface SingularVirtualQueries<T, W> {
  [key: string]: any;
  get(params?: W | null): Promise<T | undefined>;
  get<K extends keyof T>(params: W | null, column: K): Promise<T[K] | undefined>;
  get<K extends keyof T>(params: W | null, keywords: VirtualKeywordsSelect<T, K[]>): Promise<Pick<T, K> | undefined>;
  get(params: W | null, keywords: VirtualKeywordsHighlight<T>): Promise<{ id: number, highlight: string } | undefined>;
  get(params: W | null, keywords: VirtualKeywordsSnippet<T>): Promise<{ id: number, snippet: string } | undefined>;
}

interface MultipleVirtualQueries<T, W> {
  [key: string]: any;
  get(params?: W): Promise<Array<T>>;
  get<K extends keyof T>(params: W | null, columns: K[]): Promise<Array<Pick<T, K>>>;
  get<K extends keyof T>(params: W | null, column: K): Promise<Array<T[K]>>;
  get<K extends keyof T>(params: W | null, keywords: VirtualKeywordsSelect<T, K[]>): Promise<Array<Pick<T, K>>>;
  get(params: W | null, keywords: VirtualKeywordsHighlight<T>): Promise<Array<{ id: number, highlight: string }>>;
  get(params: W | null, keywords: VirtualKeywordsSnippet<T>): Promise<Array<{ id: number, snippet: string }>>;
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

interface UsersQueries {
}

interface UserQueries {
}

interface TypedDb {
  [key: string]: any,
  users: MultipleQueries<User, InsertUser, WhereUser> & UsersQueries,
  user: SingularQueries<User, InsertUser, WhereUser, number> & UserQueries,
  batch:<T> (batcher: (bx: TypedDb) => T) => Promise<Unwrap<T>>
}

export default D1Database;
