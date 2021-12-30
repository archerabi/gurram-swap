import BigNumber from "bignumber.js";

export function fromTwosComplement(value: BigNumber | string, width: number) {
  let _value: BigNumber;
  if (typeof value === "string") {
    _value = new BigNumber(value);
  } else {
    _value = value;
  }
  let binary = value.toString(2);
  //pad width
  binary = binary.padStart(width, "0");
  if (binary.charAt(0) === "0") {
    // not a negative number, return as is
    return _value;
  }
  const charArray = Array.from(binary);
  for (var i = 0; i < charArray.length; i++) {
    if (charArray[i] === "0") {
      charArray[i] = "1";
    } else {
      charArray[i] = "0";
    }
  }
  let final = new BigNumber(charArray.join(''), 2);

  return final.plus(1).multipliedBy(-1);
}
