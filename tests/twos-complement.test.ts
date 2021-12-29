import BigNumber from "bignumber.js";

import { fromTwosComplement } from "../src/utils/twos-complement";

const expct256 = (expected: BigNumber, actual: number | string) => {
  expect(fromTwosComplement(expected, 256).toFixed()).toEqual(actual);
};

test("fromTwosComplement", () => {
  expct256(
    new BigNumber("261483784616318071485148543040731204157"),
    "261483784616318071485148543040731204157"
  );
  expct256(
    new BigNumber("1610457879197618324036826986650843609448"),
    "1610457879197618324036826986650843609448"
  );
  expct256(
    new BigNumber("1145577432605598277662216874263285465942"),
    "1145577432605598277662216874263285465942"
  );
  expct256(
    new BigNumber(
      "115792089237316195423570985008687907853269984665640551070483260949433566427356"
    ),
    "-12968974323058479563212580"
  );

  expect(fromTwosComplement(new BigNumber(254), 8).toNumber()).toEqual(-2);
  expect(fromTwosComplement(new BigNumber(1074444629), 32).toNumber()).toEqual(
    1074444629
  );

  expct256(new BigNumber(1), "1");
  expct256(new BigNumber(10), "10");
  expct256(new BigNumber(8483242342), "8483242342");

  expct256(new BigNumber('115792089237316195423570985008687907849826872307348491981792551974521118588356'),'-3443112358292072057665032033392011051580');
});
