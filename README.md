# Gurram swap [![NPM Version][npm-image]![License][license-url]]

> Typescript library for interacting with the uniswap V3 subgraphs. 


<!-- [![Build Status][travis-image]][travis-url] -->
<!-- [![Downloads Stats][npm-downloads]][npm-url] -->

Gurram swap is a library for querying the uniswap v3 subgraph. 
* It supports the Ethereum mainnet as wells as L2 networks like Polygon and Optimism.
* injects summaries for positions (liquidity in fiat, uncollected fees etc).
* uses bignumber.js to represent big numbers. Handles two's complement where necessary. 


![](header.png)

## Installation

```sh
npm install gurram-swap --save
```

## Usage example
```typescript
// Use the provided clients
import { clients, EthereumNetworkName } from "gurram-swap";
const client = await clients[EthereumNetworkName.Mainnet];

// OR create a new instance 
const network = EthereumNetworkName.Polygon;
const client = new Unigraph(network);

// get first 100 pools
const results = await graph.getPairs({ pageSize: 100});

// get summaries for positions
const positions = await graph.getPositions({ address: "0xaddress", summaries: true});

// Custom graphql query

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

``` 

## Known issues
* Position summary is in alpha. When liquidity is added or removed, position summary will be incorrect.
* Q128.128 resolution of `feeGrowthX` is probably innacurate in some cases. 

## Release History

* 0.1.4
    * Fix for rawQuery variables parameter

* 0.1.3
    * Unigraph.rawQuery

* 0.1.0
    * The first proper release

## Meta

Abhijith Reddy – [@archerabi](https://twitter.com/archerabi)

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/archerabi](https://github.com/dbader/)


<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/gurram-swap.svg?style=flat-square
[npm-url]: https://npmjs.org/package/gurram-swap
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[license-url]: https://img.shields.io/npm/l/gurram-swap
