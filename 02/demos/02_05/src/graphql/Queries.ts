import gql from "graphql-tag";

export const GetAllQuery = gql(`
query {
  listGlobomanticsTasks(limit: 1000) {
    items {
        id
        title
        date
        description
    }
  }
}`);
