import {
  EthereumNetworkName,
  Pool,
  Unigraph,
  UniswapV3ConfigurationMap,
} from "../src";
import BigNumber from "bignumber.js";
import Chance from "chance";
import { fetch, Response } from "cross-fetch";
import PoolsMock from "./fixtures/pools.json";

const mockFetch = jest.fn(fetch);

describe("unigraph", () => {
  let underTest: Unigraph;
  const config = UniswapV3ConfigurationMap[EthereumNetworkName.Mainnet];

  beforeEach(() => {
    underTest = new Unigraph({
      network: config.name,
      configuration: config,
      fetch: mockFetch
    });
  });

  it("fetches pools", async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify(PoolsMock), {
        headers: { "Content-Type": "application/json" },
        status: 200,
        statusText: "ok",
      })
    );
    const pools = await underTest.getPairs(10);
    expect(pools.length).toEqual(10);
    const [firstPool, secondPool] = pools;
    expect(firstPool.id).toEqual("0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8");
    expect(secondPool.id).toEqual("0xcbcdf9626bc03e24f779434178a73a0b4bad62ed")
    const [poolDayData0] = secondPool.poolDayData;
    const { feesUSD, tvlUSD, volumeUSD } = poolDayData0;
    expect(feesUSD).toEqual(new BigNumber("650.813832349540687607760371420099"));
    expect(tvlUSD).toEqual(new BigNumber("333247387.1628763997406155332531935")),
    expect(volumeUSD).toEqual(new BigNumber("216937.9441165135625359201238066997"));
  });
});
