import { BigNumber } from "bignumber.js";
import { fromTwosComplement } from "../utils/twos-complement";

function read(val: string) {
  return new BigNumber(val);
}

function readNumber(val: string) {
  return Number.parseInt(val);
}

function readSigned256(val: string) {
  return fromTwosComplement(new BigNumber(val), 256);
}

export default {
  Token: {
    fields: {
      totalValueLocked: read,
      totalValueLockedUSD: read,
      decimals: readNumber,
    },
  },
  Transaction: {
    fields: {
      timestamp: {
        read(timestamp: string) {
          return new Date(Number.parseInt(timestamp) * 1000);
        },
      },
    },
  },
  Tick: {
    fields: {
      price0: read,
      price1: read,
      feeGrowthOutside0X128: readSigned256,
      feeGrowthOutside1X128: readSigned256,
      tickIdx: readNumber,
    },
  },
  Pool: {
    fields: {
      token0Price: read,
      token1Price: read,
      feeGrowthGlobal0X128: readSigned256,
      feeGrowthGlobal1X128: readSigned256,
      sqrtPrice: read,
    },
  },
  PoolDayData: {
    fields: {
      feesUSD: read,
      volumeUSD: read,
      tvlUSD: read,
    },
  },
  Position: {
    fields: {
      collectedFeesToken0: read,
      collectedFeesToken1: read,
      liquidity: read,
      feeGrowthInside0LastX128: readSigned256,
      feeGrowthInside1LastX128: readSigned256,
      depositedToken0: read,
      depositedToken1: read,
    },
  },
};
