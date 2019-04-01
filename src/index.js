import 'dotenv/config'

import express from 'express'
import { ApolloServer, gql, FilterRootFields } from 'apollo-server-express'
import cors from 'cors'
import {find, filter} from 'lodash'


const app = express()
app.use(cors())


let users = {
  1: {
    id: '1',
    username: 'hindleg',
    email: 'graham.hindle@vtbcapital.com',
    role: 'MANAGEMENT'
  },
  2: {
    id: '2',
    username: 'banonc',
    email: 'carlos.banon@vtbcapital.com',
    role: 'MANAGEMENT'
  },
  3: {
    id: '3',
    username: 'caneg',
    email: 'graham.cane@vtbcapital.com',
    role: 'LOGISTICS'
  },
}

let transactions = {
  1: {
    id: '1',
    description: " This is tran 1",
  },
  2: {
    id: '2',
    description: " This is tran 2",
  },
  3: {
    id: '3',
    description: " This is tran 3",
  },
  4: {
    id: '4',
    description: " This is tran 4",
  },

}
const schema = gql `
  type Query {
    me: User
    user(id:ID!):User
    users: [User!]
    userByRole(role: Role!): [User!]

    transactions: [Transaction!]!
    transaction(id:ID!): Transaction!

  }

  enum Role {
    CREDIT_TRADER
    PHYSICAL_TRADER
    SALES
    ORIGINATION
    MANAGEMENT
    LOGISTICS
  }

  type User {
    id:ID!
    username: String!
    email:  String!
    role: Role!
    
  }
  type Transaction{
    id:ID!
    description:String!
    transactionDirector: User!
  }
`



const resolvers = {
  Query: {
    me: (parent,args,{me}) => {
      return me
    },
    user: (parent, {id}) => {
      return users[id]
    },
    users:(parent,args) =>{
      return Object.values(users)
    },
    userByRole: (parent,{role}) => {
      return filter(users, {role:role})
    },
    transactions:() => {
      return Object.values(transactions)
    },
    transaction:(parent,{id})=> {
      return transactions[id]
    },
  },
  Transaction:{
    transactionDirector: (parent,args,{me}) =>{
      return me
    }
  }
}



const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  }
})

server.applyMiddleware({ app, path: '/graphql'})

app.listen({port:8000}, () => {
  console.log('Apollo Server on http://localhost:8000/graphql')
})