/**
 * combined with await you can "stop" the execution of code for a given number of milli
 * @param ms
 */
export function wait(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}