import BigNumber from 'bignumber.js';
import {
  Pool, Position, Tick, Token, Transaction, PoolDayData, GraphObjects,
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

function createMapper<T>(
  mapperType: GraphObjects,
) {
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
};

export function getMapper<Type extends Pool | Token | Position>(
  key: keyof typeof mappers,
): (source: Type) => Type {
  return mappers[key] as any as (Type) => Type;
}

const TypeFieldParsers = {
  Token: {
    root: mappers.Token,
    fields: {
      totalValueLocked: read,
      totalValueLockedUSD: read,
      decimals: readNumber,
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
