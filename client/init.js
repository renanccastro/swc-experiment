import { mergeTypeDefs } from '@graphql-tools/merge'

const author = `
type Author {
  id: ID! # the ! means that every author object _must_ have an id
  firstName: String
  lastName: String
  """
  the list of Posts by this author
  """
  posts: [Post]
}
`
const post = `
type Post {
  id: ID!
  title: String
  author: Author
  votes: Int
}
`
Meteor.startup(async () => {
    console.log(mergeTypeDefs([author,post]))

})
