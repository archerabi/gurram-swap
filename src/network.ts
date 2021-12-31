enum EthereumNetworkName {
  Mainnet = 'Mainnet',
  Optimism = 'Optimism',
  Polygon = 'Polygon',
}

type UniswapV3Configuration = {
  name: EthereumNetworkName;
  uniswapV3GraphApiUrl: string;
};

const UniswapV3ConfigurationMap: Record<
  EthereumNetworkName,
  UniswapV3Configuration
> = {
  [EthereumNetworkName.Mainnet]: {
    name: EthereumNetworkName.Mainnet,
    uniswapV3GraphApiUrl:
      'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
  [EthereumNetworkName.Optimism]: {
    name: EthereumNetworkName.Optimism,
    uniswapV3GraphApiUrl:
      'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-optimism-dev',
  },
  [EthereumNetworkName.Polygon]: {
    name: EthereumNetworkName.Polygon,
    uniswapV3GraphApiUrl:
      'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
  },
};

export type { UniswapV3Configuration };
export { UniswapV3ConfigurationMap, EthereumNetworkName };
