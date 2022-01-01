/* eslint-disable no-use-before-define */
import { BigNumber } from 'bignumber.js';

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

type TokenDayData = {
  id: string;
  date: Date;
  token: Token;
  volume: BigNumber;
  volumeUSD: BigNumber;
  untrackedVolumeUSD: BigNumber;
  totalValueLocked: BigNumber;
  totalValueLockedUSD: BigNumber;
  priceUSD: BigNumber;
  feesUSD: BigNumber;
  open: BigNumber;
  high: BigNumber;
  low: BigNumber;
  close: BigNumber;
};

type Token = {
  symbol?: string;
  totalValueLocked?: BigNumber;
  totalValueLockedUSD?: BigNumber;
  decimals?: number;
};

type Transaction = {
  timestamp: Date;
};
type PoolDayData = {
  date?: number;
  feesUSD?: number;
  tvlUSD?: number;
  volumeUSD?: number;
};

type Pool = {
  id?: string;
  token0?: Token;
  token1?: Token;
  feeTier?: number;
  poolDayData?: PoolDayData[];
  token0Price?: BigNumber;
  token1Price?: BigNumber;
  feeGrowthGlobal0X128?: BigNumber;
  feeGrowthGlobal1X128?: BigNumber;
  sqrtPrice?: BigNumber;
  createdAtTimestamp: Date;
  createdAtBlockNumber: number;
  tick: number;
  observationIndex: number;
  volumeToken0: BigNumber;
  volumeToken1: BigNumber;
  volumeUSD: BigNumber;
  untrackedVolumeUSD: BigNumber;
  feesUSD: BigNumber;
  txCount: number;
  collectedFeesToken0: BigNumber;
  collectedFeesToken1: BigNumber;
  collectedFeesUSD: BigNumber;
  totalValueLockedToken0: BigNumber;
  totalValueLockedToken1: BigNumber;
  totalValueLockedETH: BigNumber;
  totalValueLockedUSD: BigNumber;
  totalValueLockedUSDUntracked: BigNumber;
  liquidityProviderCount: number;
  // TODO
  // poolHourData: [PoolHourData!]!
  // mints: [Mint!]!
  // burns: [Burn!]!
  // swaps: [Swap!]!
  // collects: [Collect!]!
  // ticks: [Tick!]!
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

type GraphObjects =
  | 'Token'
  | 'Pool'
  | 'PoolDayData'
  | 'Tick'
  | 'Position'
  | 'Transaction'
  | 'TokenDayData';

export type {
  Token,
  Pool,
  PoolDayData,
  Position,
  PositionSummary,
  Transaction,
  Tick,
  TokenDayData,
  GraphObjects,
};
