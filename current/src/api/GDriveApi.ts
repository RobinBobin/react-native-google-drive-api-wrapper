interface IGDriveAccessParameters {
  accessToken: string
  fetchTimeout: number
}

export class GDriveApi {
  public static readonly INFINITE_TIMEOUT = -1

  constructor(public readonly accessParameters: IGDriveAccessParameters) {}
}
