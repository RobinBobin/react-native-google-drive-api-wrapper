import type { IGDriveAccessParameters } from './types'

export class GDriveApi {
  constructor(
    public readonly accessParameters: Readonly<IGDriveAccessParameters>
  ) {
    // Nothing to do.
  }
}
