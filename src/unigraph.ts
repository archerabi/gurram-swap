import {
  EthereumNetworkName,
  UniswapV3ConfigurationMap,
  UniswapV3Configuration,
} from "./network";
import { Pool, Position } from "./graph/types";
import { setSummary } from "./utils/position-summary";
import { gql, GraphQLClient } from "graphql-request";

// graphql
import poolsGet from "./graph/templates/pools-get";
import positionsForAddress from "./graph/templates/positions-for-address";
import { getMapper } from "./graph/type-mapper";

class Unigraph {
  private configuration: UniswapV3Configuration;
  private client: GraphQLClient;

  constructor(props: {
    network?: EthereumNetworkName;
    configuration?: UniswapV3Configuration;
    fetch?: any;
  }) {
    const { network, configuration, fetch } = props;
    if (!network && !configuration) {
      throw new Error("one of network or configuration must be provided");
    }
    if (network) {
      this.configuration = UniswapV3ConfigurationMap[network];
    } else {
      this.configuration = configuration;
    }
    this.client = new GraphQLClient(this.configuration.uniswapV3GraphApiUrl, {
      fetch,
    });
  }

  public async getPositions(props: { address: string; summaries?: boolean }) {
    const { address, summaries } = props;
    const result = await this.client.request<{ positions: Position[] }>(
      gql`
        ${positionsForAddress}
      `,
      {address}
    );
    const positions = result.positions.map(p => getMapper<Position>('Position')(p));
    if (!summaries) {
      return positions;
    }
    // TODO: find a better way
    // const _result = clone(result);
    positions.forEach(setSummary);
    return positions;
    // }
  }

  public async getPairs(pageSize: number) {
    const result = await this.client.request<{ pools: Pool[] }>(
      gql`
        ${poolsGet}
      `,
      { pageSize }
    );
    return result.pools.map((pool) => getMapper<Pool>("Pool")(pool));
  }
}

export { Unigraph };
