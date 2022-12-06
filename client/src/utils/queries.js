import { gql } from '@apollo/client';

//NEEDS WORK
export const GET_ME = gql`
  query me($username: String!) {
    user(username: $username) {
      _id
      username
      email
      thoughts {
        _id
        thoughtText
        createdAt
      }
    }
  }
`;
