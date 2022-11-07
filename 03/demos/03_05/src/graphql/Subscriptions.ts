import gql from "graphql-tag";

export const CreateTaskSubscription  = gql(`
subscription onCreateGlobomanticsTasks {
  onCreateGlobomanticsTasks{
    id,
    title,
    description,
    date
  }
}
`);
export const UpdateTaskSubscription  = gql(`
subscription onUpdateGlobomanticsTasks {
    onUpdateGlobomanticsTasks{
    id,
    title,
    description,
    date
  }
}
`);
export const DeleteTaskSubscription  = gql(`
subscription onDeleteGlobomanticsTasks {
  onDeleteGlobomanticsTasks{
    id,
    title,
    description,
    date
  }
}
`);