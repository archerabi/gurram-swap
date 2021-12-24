import { EthereumNetworkName } from "../types";
import { Unigraph } from "./uniswap";

const mainnetClient = new Unigraph(EthereumNetworkName.Mainnet);
const optimismClient = new Unigraph(EthereumNetworkName.Optimism);
const polygonClient = new Unigraph(EthereumNetworkName.Polygon);

const clients = {
  [EthereumNetworkName.Mainnet]: mainnetClient,
  [EthereumNetworkName.Optimism]: optimismClient,
  [EthereumNetworkName.Polygon]: polygonClient
};

export { clients };
