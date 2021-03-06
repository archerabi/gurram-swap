import {
  EthereumNetworkName,
  Pool,
  Position,
  Unigraph,
  UniswapV3ConfigurationMap,
} from "../src";
import BigNumber from "bignumber.js";
import { fetch, Response } from "cross-fetch";
import PoolsMock from "./fixtures/pools.json";
import PositionMock from "./fixtures/positions.json";
import RawQuerySingleMock from "./fixtures/raw-query-single.json";
import RawQueryArrayMock from "./fixtures/raw-query-array.json";

const mockFetch = jest.fn(fetch);

describe("unigraph", () => {
  let underTest: Unigraph;
  const config = UniswapV3ConfigurationMap[EthereumNetworkName.Mainnet];

  beforeEach(() => {
    underTest = new Unigraph({
      network: config.name,
      configuration: config,
      fetch: mockFetch,
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
    const pools = await underTest.getPairs({ pageSize: 10 });
    expect(pools.length).toEqual(10);
    const [firstPool, secondPool] = pools;
    expect(firstPool.id).toEqual("0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8");
    expect(secondPool.id).toEqual("0xcbcdf9626bc03e24f779434178a73a0b4bad62ed");
    const [poolDayData0] = secondPool.poolDayData;
    const { feesUSD, tvlUSD, volumeUSD } = poolDayData0;
    expect(feesUSD).toEqual(
      new BigNumber("650.813832349540687607760371420099")
    );
    expect(tvlUSD).toEqual(
      new BigNumber("333247387.1628763997406155332531935")
    ),
      expect(volumeUSD).toEqual(
        new BigNumber("216937.9441165135625359201238066997")
      );
  });

  it("fetches positions", async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify(PositionMock), {
        headers: { "Content-Type": "application/json" },
        status: 200,
        statusText: "ok",
      })
    );
    const positions = await underTest.getPositions({
      address: "address",
      summaries: true,
    });
    expect(positions.length).toEqual(3);
    const [firstPosition] = positions;
    expect(firstPosition.liquidity).toEqual(
      new BigNumber("374280961216906459")
    );
    expect(firstPosition.feeGrowthInside0LastX128).toEqual(
      new BigNumber("-3443112358292072057665032033392011051580")
    );
    expect(firstPosition.pool.token0.symbol).toEqual("WMATIC");
    expect(firstPosition.pool.token1.symbol).toEqual("USDC");
    expect(firstPosition.tickLower.tickIdx).toEqual(-267150);
    expect(firstPosition.tickUpper.tickIdx).toEqual(-265880);
  });

  it("fetches graph object with raw query", async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify(RawQuerySingleMock), {
        headers: { "Content-Type": "application/json" },
        status: 200,
        statusText: "ok",
      })
    );
    const query = `
    query {
      position(id:"1"){
        id
        token0{
          symbol
        }
        pool {
          id
        }
        
      }
    }
    `;
    const position = await underTest.rawQuery<Position>({
      query,
      mapper: "Position",
    });
    expect(position.id).toEqual("1");
    expect(position.pool.id).toEqual(
      "0x0e44ceb592acfc5d3f09d996302eb4c499ff8c10"
    );
  });

  it("fetches graph object array with raw query", async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify(RawQueryArrayMock), {
        headers: { "Content-Type": "application/json" },
        status: 200,
        statusText: "ok",
      })
    );
    const query = `
    query {
      pools(first: 5){
        id
        token0{
          symbol
        }
        token1{
          symbol
        }
        
      }
    }
    `;
    const pools = await underTest.rawQuery<Pool[]>({ query, mapper: "Pool" });
    expect(pools.length).toEqual(5);
    const [firstPool] = pools;
    expect(firstPool.id).toEqual("0x00b15004f026994582c07777ca837c535b2fcd88");
    expect(firstPool.token0.symbol).toEqual("WETH");
  });

  afterEach(() => {
    mockFetch.mockReset();
  });
});
