import gql from "graphql-tag";

export const CreateTaskMutation = gql(`
mutation createGlobomanticsTasks($createglobomanticstasksinput: CreateGlobomanticsTasksInput!) {
  createGlobomanticsTasks(input: $createglobomanticstasksinput) {
      id
      title
      date
      description
    }
  }
`);

export const UpdateTaskMutation = gql(`
mutation updateGlobomanticsTasks($updateglobomanticstasksinput: UpdateGlobomanticsTasksInput!) {
  updateGlobomanticsTasks(input: $updateglobomanticstasksinput) {
      id
      title
      date
      description
    }
  }
`);

export const DeleteTaskMutation = gql(`
mutation deleteGlobomanticsTasks($deleteglobomanticstasksinput: DeleteGlobomanticsTasksInput!) {
  deleteGlobomanticsTasks(input: $deleteglobomanticstasksinput) {
      id
    }
  }
`);
