# Fluent SQL Builder

## Métodos

Pressupondo que você tenha uma instância:

```js
const fluentQuery = new FluentSql();
```

Você pode construir das seguintes formas:

```js
// SELECT - Seleção de Collection/Tabela
fluentQuery.select("table_name")
  .where("key", "value") // BUSCA COM CONDICIONAL
  .orderBy("key", "ASC") // ORDENAÇÃO POR CHAVE - ASC ou DESC
  .buid() // EXECUTA DE FATO A QUERY

// INSERT INTO - Inserção na Collection/Tabela
fluentQuery.insert("table_name")
  // COLUNAS E VALORES A SEREM INSERIDOS
  .values("key", "value")
  .values("key-2", "value-2")
  .build() // EXECUTA DE FATO A QUERY

// UPDATE - Atualizaçao na Collection/Tabela
fluentQuery.update("table_name")
  // COMPOSICÃO OBRIGATÓRIA PARA FAZER O UPDATE
  .where("id", "id_para_update")
  .values("key", "updated-value")
  .build() // EXECUTA DE FATO A QUERY
```

## Exemplos de Uso

**SQL de inserção:**

```js
const fluentQuery = new FluentSql();

fluentQuery
  .insert("table_name")
  .values("key", "value")
  .values("key2", "value-2")
  .build()
```

Isso irá inserir o objeto:

```js
// table_name
{
  "key": "value",
  "key2": "value-2",
  "createdAt": 1624507177889,
  "updatedAt": 1624507177889
}
```

**SQL de consulta:**

```js
const fluentQuery = new FluentSql();

fluentQuery
  .select("table_name")
  .where("key", "value")
  .orderBy("createdAt", "DESC")
  .build()
```

Isso irá retornar o **array**:

```js
// table_name
[
  {
    "id": "ww7oBaHTV1SeWA5mRuAo",
    "key": "value",
    "key2": "value-2",
    "createdAt": 1624507177889,
    "updatedAt": 1624507177889
  }
]
```

**SQL de Atualização:**

```js
const fluentQuery = new FluentSql();

fluentQuery
  .update("table_name")
   // O WHERE COM A KEY id É OBRIGATÓRIO NO UPDATE
  .where("id", "ww7oBaHTV1SeWA5mRuAo")
  .values("key", "value-atualizado")
  .build()
```

Isso irá retornar o objeto:

```js
// table_name
{
  "id": "ww7oBaHTV1SeWA5mRuAo",
  "key": "value-atualizado",
  "key2": "value-2",
  "createdAt": 1624507177889,
  "updatedAt": 1624507217108
}
```

**SQL Listener:**

```js
const fluentQuery = new FluentSql();

const [keyListener, setKeyListener] = useState({});

fluentQuery
  .select("table_name")
  .where("id", "ww7oBaHTV1SeWA5mRuAo")
  .orderBy("createdAt", "DESC")
  .listener(setKeyListener)
```

Isso irá syncronizar o objeto:

```js
// table_name
{
  "id": "ww7oBaHTV1SeWA5mRuAo",
  "key": "value-atualizado",
  "key2": "value-2",
  "createdAt": 1624507177889,
  "updatedAt": 1624507217108
}
```
