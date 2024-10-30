import type { IGDriveAccessParameters } from './types'

export class GDriveApi {
  public static readonly INFINITE_TIMEOUT = -1

  constructor(
    public readonly accessParameters: Readonly<IGDriveAccessParameters>
  ) {
    // Nothing to do.
  }
}
