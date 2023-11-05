export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('Max daily check ins reached')
  }
}
