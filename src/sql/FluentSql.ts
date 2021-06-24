import firebase from "firebase";
import 'firebase/firestore';

import { ConditionType, Join, Order, SqlContract } from "./sql-contract";

export class FluentSql implements SqlContract {

  private query: 'read_query' | 'write_query' | 'update_query' = 'read_query';
  private tableName: string | null = '';
  private condition: Map<string, any> = new Map();

  private _values: Map<string, any> = new Map();
  private orders: Map<string, Order> = new Map();

  select(tableName: string): SqlContract {
    this.query = 'read_query';
    this.tableName = tableName;
    
    return this;
  }

  insert(tableName: string): SqlContract {
    this.query = 'write_query';
    this.tableName = tableName;

    return this;
  }

  update(tableName: string): SqlContract {
    this.query = 'update_query';
    this.tableName = tableName;

    return this;
  }

  values(key: string, value: any) {
    this._values.set(key, value)

    return this;
  }

  where(condition: string): SqlContract {

    const results = new RegExp(/(?<field>(?<=.*)(\w*)).*(?<value>(?<==).*)/gi).exec(condition)
    
    const groups = results?.groups as ConditionType;

    if( results?.groups ) {
      this.condition.set(groups.field, groups.value)
    }
    
    return this;
  }

  inner(condition: string, type: Join): SqlContract {    
    return this;
  }

  orderBy(key: string, type: Order = "ASC"): SqlContract {
    this.orders.set(key, type)

    return this;
  }

  async build<T = any>(): Promise<T | any> {
    if(!this.tableName)
      return Promise.reject();

    if(this.query === 'read_query') {
      let collection: any = firebase
        .firestore()
        .collection(this.tableName)

      if(this.condition.size > 0) {

        if( this.condition.has('id') || this.condition.has('uid')  ){
          collection = collection.doc(this.condition.get('id'))
        }else {        
          const conditions = [...this.condition.entries()];
          console.log(conditions)
          conditions.forEach(condition => {
            collection = collection.where(condition[0], '==', condition[1]);
          })
        }
        
      }

      if(this.orders.size > 0) {
        const orders = [...this.orders.entries()];
        orders.forEach(([key, value]) => {
          collection = collection.orderBy(key, value.toLowerCase())
        })
      }

      return collection
        .get()
        .then((coll: any) => {
          if(coll.docs){           
            return  coll.docs?.map((doc: any) => ({
              id: doc.id,
              ...doc.data()
            }))
          }
          return [{
            id: coll.id,
            ...coll.data()
          }];
        })
    }

    if(this.query === 'write_query') {
      const addObject = {
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      [...this._values.entries()].forEach(([key, value]) => {
        Object.assign(addObject, { [key]: value })
      })

      const collection = await firebase
        .firestore()
        .collection(this.tableName)
        .add(addObject)

      return !!collection.id
    }

    if(this.query === 'update_query') {
      if(!this.condition.get('id')) {
        throw new Error("Para atualizar adicione o metodo 'where(\"id\", \"id_para_atualizar\")")
      }

      const updateObject = {};

      [...this._values.entries()].forEach(([key, value]) => {
        Object.assign(updateObject, { [key]: value })
      })

      const id = this.condition.get('id');

      const [oldData] = await this.select(this.tableName)
        .where(id)
        .build<any[]>()

      await firebase
        .firestore()
        .collection(this.tableName)
        .doc(id)
        .set({
          ...oldData,
          ...updateObject,
          updatedAt: Date.now()
        })

      const [updated] = await this.select(this.tableName)
        .where(id)
        .build<any[]>();

      return updated
    }
  }

  listener(callback?: (any: any | any[]) => any) {
    if(!this.tableName)
      return Promise.reject();

    let collection: any = firebase
      .firestore()
      .collection(this.tableName)

    if( this.condition.has('id') ) {
      return collection.doc(this.condition.get('id'))
        .onSnapshot((doc: any) => {
          if(callback)
            callback(doc.data())
        })
    }

    if(this.orders.size > 0) {
      const orders = [...this.orders.entries()];
      orders.forEach(([key, value]) => {
        collection = collection.orderBy(key, value.toLowerCase())
      })
    }

    return collection.onSnapshot((snapshot: any) => {

      const docs: any[] = [] as any[];

      snapshot.docs.forEach((doc: any) => {
        console.log(doc?.data())
        docs.push(doc.data())
      })

      if(callback)
        callback(docs)
    })
  }
}