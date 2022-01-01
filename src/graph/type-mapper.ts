/* eslint-disable no-restricted-syntax,no-use-before-define */
import BigNumber from 'bignumber.js';
import {
  Pool,
  Position,
  Tick,
  Token,
  Transaction,
  PoolDayData,
  GraphObjects,
  TokenDayData,
} from './types';
import { fromTwosComplement } from '../utils/twos-complement';

function read(val: string) {
  return new BigNumber(val);
}

function readNumber(val: string) {
  return Number.parseInt(val, 10);
}

function readSigned256(val: string) {
  return fromTwosComplement(new BigNumber(val), 256);
}

function createMapper<T>(mapperType: GraphObjects) {
  return (source: T) => {
    const mapped = {};
    for (const [key, value] of Object.entries(source)) {
      if (key in TypeFieldParsers[mapperType].fields) {
        mapped[key] = TypeFieldParsers[mapperType].fields[key](value);
      } else {
        mapped[key] = value;
      }
    }
    return mapped as T;
  };
}

const mappers = {
  Pool: createMapper<Pool>('Pool'),
  Token: createMapper<Token>('Token'),
  PoolDayData: createMapper<PoolDayData>('PoolDayData'),
  Position: createMapper<Position>('Position'),
  Tick: createMapper<Tick>('Tick'),
  Transaction: createMapper<Transaction>('Transaction'),
  TokenDayData: createMapper<TokenDayData>('TokenDayData'),
};

export function getMapper<Type extends Pool | Token | Position>(
  key: keyof typeof mappers,
  /* eslint-disable-next-line no-unused-vars */
): (source: Type) => Type {
  /* eslint-disable-next-line no-unused-vars */
  return mappers[key] as any as (source: Type) => Type;
}

const TypeFieldParsers = {
  Token: {
    root: mappers.Token,
    fields: {
      totalValueLocked: read,
      totalValueLockedUSD: read,
      decimals: readNumber,
      totalSupply: read,
      volume: read,
      volumeUSD: read,
      untrackedVolumeUSD: read,
      feesUSD: read,
      txCount: readNumber,
      poolCount: readNumber,
      totalValueLockedUSDUntracked: read,
      derivedETH: read,
      whitelistPools: (val: Pool[]) => val.map(mappers.Pool),
      tokenDayData: (val: TokenDayData[]) => val.map(mappers.TokenDayData),
    },
  },
  TokenDayData: {
    root: () => {},
    fields: {
      token: mappers.Token,
      volume: read,
      volumeUSD: read,
      untrackedVolumeUSD: read,
      totalValueLocked: read,
      totalValueLockedUSD: read,
      priceUSD: read,
      feesUSD: read,
      open: read,
      high: read,
      low: read,
      close: read,
    },
  },
  Transaction: {
    root: mappers.Transaction,
    fields: {
      timestamp: {
        read(timestamp: string) {
          return new Date(Number.parseInt(timestamp, 10) * 1000);
        },
      },
    },
  },
  Tick: {
    root: mappers.Tick,
    fields: {
      price0: read,
      price1: read,
      feeGrowthOutside0X128: readSigned256,
      feeGrowthOutside1X128: readSigned256,
      tickIdx: readNumber,
    },
  },
  Pool: {
    root: mappers.Pool,
    fields: {
      token0Price: read,
      token1Price: read,
      feeGrowthGlobal0X128: readSigned256,
      feeGrowthGlobal1X128: readSigned256,
      sqrtPrice: read,
      poolDayData: (val: PoolDayData[]) => val.map(mappers.PoolDayData),
      token0: mappers.Token,
      token1: mappers.Token,
      feeTier: readNumber,
      createdAtBlockNumber: readNumber,
      tick: readNumber,
      observationIndex: readNumber,
      volumeToken0: read,
      volumeToken1: read,
      volumeUSD: read,
      untrackedVolumeUSD: read,
      feesUSD: read,
      txCount: readNumber,
      collectedFeesToken0: read,
      collectedFeesToken1: read,
      collectedFeesUSD: read,
      totalValueLockedToken0: read,
      totalValueLockedToken1: read,
      totalValueLockedETH: read,
      totalValueLockedUSD: read,
      totalValueLockedUSDUntracked: read,
      liquidityProviderCount: readNumber,
    },
  },
  PoolDayData: {
    root: mappers.PoolDayData,
    fields: {
      feesUSD: read,
      volumeUSD: read,
      tvlUSD: read,
    },
  },
  Position: {
    root: mappers.Position,
    fields: {
      tickLower: mappers.Tick,
      tickUpper: mappers.Tick,
      pool: mappers.Pool,
      token0: mappers.Token,
      token1: mappers.Token,
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
