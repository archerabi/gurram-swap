import {
  ApolloClient,
  InMemoryCache,
  gql,
  NormalizedCacheObject,
} from "@apollo/client/core";
import BigNumber from "bignumber.js";
import {
  EthereumNetworkName,
  UniswapV3ConfigurationMap,
  UniswapV3Configuration,
} from "../types";
import * as R from "ramda";

const { clone } = R;

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
  poolDayData: PoolDayData[];
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
  summary: PositionSummary;
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

function read(val: string) {
  return new BigNumber(val);
}

function readNumber(val: string) {
  return Number.parseInt(val);
}

const getDecimals = (token: Token) => {
  return token.symbol === "USDC" ? 6 : 18;
};

function setSummary(position: Position) {
  const feeGrowthOutside0X128_lower = position.tickLower.feeGrowthOutside0X128;
  const feeGrowthOutside1X128_lower = position.tickLower.feeGrowthOutside1X128;
  const feeGrowthOutside0X128_upper = position.tickUpper.feeGrowthOutside0X128;
  const feeGrowthOutside1X128_upper = position.tickUpper.feeGrowthOutside1X128;
  const feeGrowthGlobal0X128 = position.pool.feeGrowthGlobal0X128;
  const feeGrowthGlobal1X128 = position.pool.feeGrowthGlobal1X128;
  const feeGrowthInside0LastX128 = position.feeGrowthInside0LastX128;
  const feeGrowthInside1LastX128 = position.feeGrowthInside1LastX128;

  const { token1, token0 } = position;
  const token0PriceUSD = token0.totalValueLockedUSD.div(
    token0.totalValueLocked
  );
  const token1PriceUSD = token1.totalValueLockedUSD.div(
    token1.totalValueLocked
  );
  const token0ValueLockedUSD = token0PriceUSD.multipliedBy(
    position.depositedToken0
  );
  const token1ValueLockedUSD = token1PriceUSD.multipliedBy(
    position.depositedToken1
  );
  const feesToken0 = feeGrowthGlobal0X128
    .minus(feeGrowthOutside0X128_lower)
    .minus(feeGrowthOutside0X128_upper)
    .minus(feeGrowthInside0LastX128)
    .div(2 ** 128)
    .multipliedBy(position.liquidity)
    .div(10 ** getDecimals(token0));

  const feesToken1 = feeGrowthGlobal1X128
    .minus(feeGrowthOutside1X128_lower)
    .minus(feeGrowthOutside1X128_upper)
    .minus(feeGrowthInside1LastX128)
    .div(2 ** 128)
    .multipliedBy(position.liquidity)
    .div(10 ** getDecimals(token1));

  let token0Amount = new BigNumber(0);
  let token1Amount = new BigNumber(0);

  if (position.liquidity.gt(0)) {
    const sqrtPriceA = new BigNumber(
      1.0001 ** position.tickLower.tickIdx
    ).squareRoot();
    const sqrtPriceB = new BigNumber(
      1.0001 ** position.tickUpper.tickIdx
    ).squareRoot();

    token0Amount = position.liquidity
      .multipliedBy(
        sqrtPriceB
          .minus(position.pool.sqrtPrice.div(2 ** 96))
          .div(position.pool.sqrtPrice.div(2 ** 96))
          .div(sqrtPriceB)
      )

      .div(new BigNumber(10 ** token0.decimals));
    token1Amount = position.liquidity
      .multipliedBy(position.pool.sqrtPrice.div(2 ** 96).minus(sqrtPriceA))
      .div(new BigNumber(10 ** token1.decimals));
  }

  position.summary = {
    token0ValueLockedUSD,
    token1ValueLockedUSD,
    token0PriceUSD,
    token1PriceUSD,
    feesToken0,
    feesToken1,
    token0Amount,
    token1Amount,
    feesToken0USD: feesToken0.multipliedBy(token0PriceUSD),
    feesToken1USD: feesToken1.multipliedBy(token1PriceUSD),
  };
}

class Unigraph {
  private configuration: UniswapV3Configuration;
  private _client: ApolloClient<NormalizedCacheObject>;

  constructor(network: EthereumNetworkName) {
    this.configuration = UniswapV3ConfigurationMap[network];
    const cache = new InMemoryCache({
      typePolicies: {
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
            feeGrowthOutside0X128: read,
            feeGrowthOutside1X128: read,
            tickIdx: readNumber,
          },
        },
        Pool: {
          fields: {
            token0Price: read,
            token1Price: read,
            feeGrowthGlobal0X128: read,
            feeGrowthGlobal1X128: read,
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
            feeGrowthInside0LastX128: read,
            feeGrowthInside1LastX128: read,
            depositedToken0: read,
            depositedToken1: read,
          },
        },
      },
    });
    this._client = new ApolloClient({
      uri: this.configuration.uniswapV3GraphApiUrl,
      cache,
    });
  }

  public async getPositions(address: string) {
    const result = await this._client.query<{ positions: Position[] }>({
      query: gql`
        query getPositions($address: String!) {
          positions(where: { owner: $address }) {
            id
            feeGrowthInside0LastX128
            feeGrowthInside1LastX128
            depositedToken0
            depositedToken1
            token0 {
              symbol
              totalValueLocked
              totalValueLockedUSD
              decimals
            }
            token1 {
              symbol
              totalValueLocked
              totalValueLockedUSD
              decimals
            }
            tickLower {
              price0
              price1
              feeGrowthOutside0X128
              feeGrowthOutside1X128
              tickIdx
            }
            tickUpper {
              price0
              price1
              feeGrowthOutside0X128
              feeGrowthOutside1X128
              tickIdx
            }
            liquidity
            collectedFeesToken0
            collectedFeesToken1
            pool {
              token0Price
              token1Price
              sqrtPrice
              token0 {
                symbol
              }
              token1 {
                symbol
              }
              feeTier
              feeGrowthGlobal0X128
              feeGrowthGlobal1X128
              poolDayData(first: 2, orderDirection: desc, orderBy: date) {
                tvlUSD
                volumeUSD
                feesUSD
                date
              }
            }
            transaction {
              timestamp
            }
          }
        }
      `,
      variables: { address },
    });
    if (!result.error) {
      // const _result = rfdc()(result);
      const _result = clone(result);
      _result.data.positions.forEach(setSummary);
      return _result;
    }
    return result;
  }

  public async getPairs(pageSize: number) {
    const result = await this._client.query<{ pools: Pool[] }>({
      query: gql`
        query getPools($pageSize: Int!) {
          pools(first: $pageSize, orderBy: totalValueLockedUSD, orderDirection: desc) {
            id
            token0 {
              symbol
            }
            token1 {
              symbol
            }
            feeTier
            poolDayData(first: 2, orderDirection: desc, orderBy: date) {
              tvlUSD
              volumeUSD
              feesUSD
              date
            }
          }
        }
      `,
      variables: { pageSize }
    });
    return result;
  }
}

export type { Pool, Position, PoolDayData, Token, PositionSummary };
export { Unigraph };
