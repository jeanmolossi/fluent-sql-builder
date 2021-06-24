export type Join = "inner" | "left" | "right";

export type Order = "ASC" | "DESC";

export type ConditionType = {
  field: string;
  value: any
}

export interface SqlContract {
  select(tableName: string): SqlContract
  insert(tableName: string): SqlContract
  update(tableName: string): SqlContract
  values(key: string, value: any): SqlContract
  where(condition: string): SqlContract
  inner(condition: string, type: Join): SqlContract
  orderBy(key: string, type: Order): SqlContract
  build<T>(): Promise<T>
  listener(callback?: (...any: any[]) => any): void
}