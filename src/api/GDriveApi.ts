interface GDriveApiAccessParameters {
  accessToken: string
  fetchTimeout: number
}

export class GDriveApi {
  constructor(public readonly accessParameters: GDriveApiAccessParameters) {}
}
