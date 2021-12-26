export default `
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
`;
