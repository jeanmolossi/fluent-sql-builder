import React from 'react'
import { Messages } from '../messages'

interface ChatScreenProps {}

export const ChatScreen = ({}: ChatScreenProps) => {
  return (
    <>
      <h1>OLAR</h1>
      <Messages/>
    </>
  )
}