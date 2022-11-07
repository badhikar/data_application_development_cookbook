import gql from "graphql-tag";

export const CreateTaskMutation = gql(`
mutation createTask($createtaskinput: CreateTaskInput!) {
    createTask(input: $createtaskinput) {
      id
      title
      date
      description
    }
  }
`);

export const UpdateTaskMutation = gql(`
mutation updateTask($updatetaskinput: UpdateTaskInput!) {
    updateTask(input: $updatetaskinput) {
      id
      title
      date
      description
    }
  }
`);

export const DeleteTaskMutation = gql(`
mutation DeleteTask($deletetaskinput: DeleteTaskInput!) {
  deleteTask(input: $deletetaskinput) {
      id
    }
  }
`);
