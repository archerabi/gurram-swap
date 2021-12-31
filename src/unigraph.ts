import { gql, GraphQLClient } from "graphql-request";
import {
  EthereumNetworkName,
  UniswapV3ConfigurationMap,
  UniswapV3Configuration,
} from "./network";
import { GraphObjects, Pool, Position } from "./graph/types";
import { getSummary } from "./utils/position-summary";

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
      { address }
    );
    const positions = result.positions.map((p) =>
      getMapper<Position>("Position")(p)
    );
    if (!summaries) {
      return positions;
    }
    // TODO: find a better way
    // const _result = clone(result);
    positions.forEach((pos) => {
      const summary = getSummary(pos);
      // eslint-disable-next-line no-param-reassign
      pos.summary = summary;
    });
    return positions;
    // }
  }

  public async getPairs(props: { pageSize: number }) {
    const { pageSize } = props;
    const result = await this.client.request<{ pools: Pool[] }>(
      gql`
        ${poolsGet}
      `,
      { pageSize }
    );
    return result.pools.map((pool) => getMapper<Pool>("Pool")(pool));
  }

  /**
   * Execute a custom Graphql query.
   * @param {string} query - the Graphql query
   * @param {string: any} variables -variables for the query if any
   * @param {GraphObjects} mapper - the mapper name for the root object.
   * */
  public async rawQuery<T>({
    query,
    variables,
    mapper,
  }: {
    query: string;
    variables?: { string: any };
    mapper: GraphObjects;
  }): Promise<T> {
    const result = await this.client.request<T>(
      gql`
        ${query}
      `,
      variables
    );
    const [firstKey] = Object.keys(result);
    if (result[firstKey] instanceof Array) {
      return result[firstKey].map((o) => getMapper<T>(mapper)(o));
    }
    return getMapper<T>(mapper)(result[firstKey]);
  }
}

export { Unigraph };
