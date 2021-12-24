# Gurram swap
> Typescript library for interacting with the uniswap V3 subgraphs. 

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]

Gurram swap is a library for querying the uniswap v3 subgraph. It supports the Ethereum mainnet as wells as L2 networks like Polygon and Optimism.

![](header.png)

## Installation

```sh
npm install gurram-swap --save
```

## Usage example
```
// Use the provided clients
import { clients, EthereumNetworkName } from "gurram-swap";
const client = await clients[EthereumNetworkName.Mainnet];

// OR create a new instance 
const network = EthereumNetworkName.Polygon;
const client = new Unigraph(network);

// get first 100 pools
const results = await graph.getPairs(100);

``` 


## Release History

* 0.1.0
    * The first proper release

## Meta

Abhijith Reddy – [@archerabi](https://twitter.com/archerabi)

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/archerabi](https://github.com/dbader/)


<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki
