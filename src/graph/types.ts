import { BigNumber } from "bignumber.js";
type Token = {
  symbol: string;
  totalValueLocked: BigNumber;
  totalValueLockedUSD: BigNumber;
  decimals: number;
};

type Transaction = {
  timestamp: Date;
};
type PoolDayData = {
  date: number;
  feesUSD: number;
  tvlUSD: number;
  volumeUSD: number;
};

type Pool = {
  id: string;
  token0: Token;
  token1: Token;
  feeTier: number;
  poolDayData?: PoolDayData[];
  token0Price: BigNumber;
  token1Price: BigNumber;
  feeGrowthGlobal0X128: BigNumber;
  feeGrowthGlobal1X128: BigNumber;
  sqrtPrice: BigNumber;
};

type Tick = {
  id: string;
  price0: BigNumber;
  price1: BigNumber;
  feeGrowthOutside0X128: BigNumber;
  feeGrowthOutside1X128: BigNumber;
  tickIdx: number;
};

type Position = {
  id: number;
  owner: string;
  pool: Pool;
  token0: Token;
  token1: Token;
  tickLower: Tick;
  tickUpper: Tick;
  liquidity: BigNumber;
  depositedToken0: BigNumber;
  depositedToken1: BigNumber;
  withdrawnToken0: BigNumber;
  withdrawnToken1: BigNumber;
  collectedFeesToken0: BigNumber;
  collectedFeesToken1: BigNumber;
  transaction: Transaction;
  feeGrowthInside0LastX128: BigNumber;
  feeGrowthInside1LastX128: BigNumber;
  summary?: PositionSummary;
};

type PositionSummary = {
  token0ValueLockedUSD: BigNumber;
  token1ValueLockedUSD: BigNumber;
  token0PriceUSD: BigNumber;
  token1PriceUSD: BigNumber;
  feesToken0: BigNumber;
  feesToken1: BigNumber;
  feesToken0USD: BigNumber;
  feesToken1USD: BigNumber;
  token0Amount: BigNumber;
  token1Amount: BigNumber;
};

export type {
  Token,
  Pool,
  PoolDayData,
  Position,
  PositionSummary,
  Transaction,
  Tick,
};
