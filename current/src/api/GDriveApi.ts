interface IGDriveAccessParameters {
  accessToken: string
  fetchTimeout: number
}

export class GDriveApi {
  constructor(public readonly accessParameters: IGDriveAccessParameters) {}
}
