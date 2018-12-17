/**
 * generate a random uuid for usage in ids, an adapted script of the following discussion
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
export function generateUuid():string {
  return (String([1e7]) + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    (c: string) =>
      (
        Number(c) ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
      ).toString(16)
  );
}
