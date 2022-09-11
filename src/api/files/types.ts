export interface CreateIfNotExistsResultType<ExecuteResultType> {
  alreadyExisted: boolean
  result: ExecuteResultType
}
