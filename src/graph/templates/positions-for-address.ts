export default `query getPositions($address: String!) {
  positions(where: { owner: $address }) {
    id
    feeGrowthInside0LastX128
    feeGrowthInside1LastX128
    depositedToken0
    depositedToken1
    withdrawnToken0
    withdrawnToken1
    token0 {
      symbol
      totalValueLocked
      totalValueLockedUSD
      decimals
      derivedETH
    }
    token1 {
      symbol
      totalValueLocked
      totalValueLockedUSD
      decimals
      derivedETH
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
`;
