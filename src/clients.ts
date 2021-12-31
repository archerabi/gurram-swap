import { EthereumNetworkName } from './network';
import { Unigraph } from './unigraph';

const mainnetClient = new Unigraph({ network: EthereumNetworkName.Mainnet });
const optimismClient = new Unigraph({ network: EthereumNetworkName.Optimism });
const polygonClient = new Unigraph({ network: EthereumNetworkName.Polygon });

const clients = {
  [EthereumNetworkName.Mainnet]: mainnetClient,
  [EthereumNetworkName.Optimism]: optimismClient,
  [EthereumNetworkName.Polygon]: polygonClient,
};

export { clients };
