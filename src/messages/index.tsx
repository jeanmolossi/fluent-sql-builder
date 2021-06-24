import React, { useState, useEffect, Fragment } from 'react'
import { FluentSql } from '../sql/FluentSql'

interface MessagesProps {}

interface User {
  name: string;
  email: string;
  createdAt?: number;
}

const sqlRunner = new FluentSql();

export const Messages = ({}: MessagesProps) => {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // sqlRunner.insert("users")
    //   .values("name", "3.1 Vicente")
    //   .values("email", "email@outro.vicente")
    //   .build()

    // sqlRunner.update("users")
    //   .values('id', "q5k7bq8VTLssCdmkG18M")
    //   .values("name", "4 Vicente / Editado")
    //   .build()
  }, [])

  useEffect(() => {
    sqlRunner.select("users")
      .orderBy("updatedAt", "DESC")
      .build<User[]>()
      .then(setUsers)
  }, []) 

  return (
    <>{users.map(user => (
      <Fragment key={user.email}>
        {user.name}
        {' => '}
        {user.email} {user.createdAt ? "-->"+ user.createdAt : ''}
        <br />
      </Fragment>
    ))}</>
  )
}