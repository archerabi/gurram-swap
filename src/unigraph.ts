import {
  ApolloClient,
  InMemoryCache,
  gql,
  NormalizedCacheObject,
  HttpLink,
  ApolloLink,
} from "@apollo/client/core";
import {fetch} from 'cross-fetch';

import {
  EthereumNetworkName,
  UniswapV3ConfigurationMap,
  UniswapV3Configuration,
} from "./network";
import * as R from "ramda";
import UniswapTypePolicy from "./graph/type-policy";
import {
  Pool,
  Position,
} from "./graph/types";
import { setSummary } from "./utils/position-summary";

const { clone } = R;

// graphql
import poolsGet from './graph/templates/pools-get';
import positionsForAddress from './graph/templates/positions-for-address';

class Unigraph {
  private configuration: UniswapV3Configuration;
  private _client: ApolloClient<NormalizedCacheObject>;

  constructor(props: {
    network?: EthereumNetworkName;
    configuration?: UniswapV3Configuration;
    link?: ApolloLink
  }) {
    const { network, configuration, link } = props;
    if (!network && !configuration) {
      throw new Error("one of network or configuration must be provided");
    }
    if (network) {
      this.configuration = UniswapV3ConfigurationMap[network];
    } else {
      this.configuration = configuration;
    }

    const cache = new InMemoryCache({
      typePolicies: UniswapTypePolicy,
    });
    this._client = new ApolloClient({
      // uri: this.configuration.uniswapV3GraphApiUrl,
      link: link ? link : new HttpLink({ uri: this.configuration.uniswapV3GraphApiUrl, fetch }),
      cache,
    });
  }

  public async getPositions(props: {address: string, summaries?: boolean}) {
    const {address, summaries} = props;
    const result = await this._client.query<{ positions: Position[] }>({
      query: gql`${positionsForAddress}`,
      variables: { address },
    });
    if (!result.error) {
      if(!summaries){
        return result;
      }
      // results from apollo are immutable. To add summary we have to clone the result
      // TODO: find a better way
      const _result = clone(result);
      _result.data.positions.forEach(setSummary);
      return _result;
    }
    return result;
  }

  public async getPairs(pageSize: number) {
    const result = await this._client.query<{ pools: Pool[] }>({
      query: gql`${poolsGet}`,
      variables: { pageSize },
    });
    return result.data.pools;
  }
}

export { Unigraph };
