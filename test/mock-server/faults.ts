/** Configurable fault injection for the mock Pix API. */

export interface ApiFault {
  readonly status: number;
  readonly retryAfterSeconds?: number;
}

/** Queue of faults consumed once each by the next matching request. */
export class FaultInjection {
  private readonly apiFaults: ApiFault[] = [];
  private readonly tokenFaults: number[] = [];
  private responseDelayMs = 0;
  private authenticationRequired = true;

  enqueueApiFault(fault: ApiFault): void {
    this.apiFaults.push(fault);
  }

  enqueueTokenFault(status: number): void {
    this.tokenFaults.push(status);
  }

  setResponseDelay(ms: number): void {
    this.responseDelayMs = ms;
  }

  setAuthenticationRequired(required: boolean): void {
    this.authenticationRequired = required;
  }

  nextApiFault(): ApiFault | undefined {
    return this.apiFaults.shift();
  }

  nextTokenFault(): number | undefined {
    return this.tokenFaults.shift();
  }

  get delayMs(): number {
    return this.responseDelayMs;
  }

  get requireAuth(): boolean {
    return this.authenticationRequired;
  }

  clear(): void {
    this.apiFaults.length = 0;
    this.tokenFaults.length = 0;
    this.responseDelayMs = 0;
    this.authenticationRequired = true;
  }
}
