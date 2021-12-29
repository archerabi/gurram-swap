import BigNumber from "bignumber.js";
import { Token, Position } from "..";

const getDecimals = (token: Token) => {
  if(token.decimals) {
    return token.decimals;
  }
  return token.symbol === "USDC" ? 6 : 18;
};

export function setSummary(position: Position) {
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
