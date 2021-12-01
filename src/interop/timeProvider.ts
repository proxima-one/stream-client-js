export interface ITimeProvider {
  now(): number;
}

export class UtcTimeProvider implements ITimeProvider {
  public now(): number {
    return new Date().getTime();
  }
}
