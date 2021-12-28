import poolsGet from './fixtures/pools.json';
import { getMapper } from '../src/graph/type-mapper';
import BigNumber from 'bignumber.js';
import { Pool } from '../src';

describe('type-mapper' , () => {
    it('maps pools', () => {
        const res = getMapper<Pool>('Pool')(poolsGet.data.pools[0] as any as Pool);
        expect(res.id).toEqual('0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8');
        expect(res.feeTier).toEqual(3000);
        expect(res.token0.decimals).toEqual(6);
        expect(res.token0.totalValueLocked instanceof BigNumber).toBeTruthy();
        const [dayData] = res.poolDayData;
        expect(dayData.feesUSD).toEqual(new BigNumber('12791.88575426482497427324107174149'));
        expect(dayData.tvlUSD).toEqual(new BigNumber('438768743.9837458121343248819129629'));
    })
});

