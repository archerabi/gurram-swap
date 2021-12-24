import BigNumber from "bignumber.js";

export function fromTwosComplement(value: BigNumber | string, width: number) {
  let _value = value;
  if (typeof value === "string") {
    _value = new BigNumber(value);
  }
  let binary = value.toString(2);
  //pad width
  binary = binary.padStart(width, '0');
  let final = new BigNumber(binary.slice(1),2);
  return final.plus(
    new BigNumber(
      parseInt(binary.charAt(0)) * 2 ** (binary.length-1)
    ).negated()
  );
}