export class NotInsideHookException extends Error {
  constructor(hookName: string) {
    super();
    this.name = hookName;
    this.message = `${hookName} must be inside their context`;
  }
}
