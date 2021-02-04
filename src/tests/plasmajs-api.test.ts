import { TextDecoder, TextEncoder } from 'text-encoding';
import { Api } from '../plasmajs-api';
import { JsonRpc } from '../plasmajs-jsonrpc';
import { JsSignatureProvider } from '../plasmajs-jssig';

const transaction = {
    expiration: '2021-01-28T08:37:35',
    ref_block_num: 39430,
    ref_block_prefix: 2500170883,
    max_net_usage_words: 0,
    max_cpu_usage_ms: 0,
    delay_sec: 0,
    context_free_actions: [] as any,
    actions: [
        {
            account: 'plasma.token',
            name: 'transfer',
            authorization: [
                {
                    actor: 'plasma.token',
                    permission: 'active',
                },
            ],
            data: {
                from: '1xgrbgownokr',
                to: 'qzblpbxvgk3n',
                quantity: '1.000000000000000000 PLASMA',
                memo: 'test transfer',
            },
            hex_data: `70219d9cb273590f300764bb9f1acfb71b312e30303030303030303030303030303030303020504c41534d410d7465737
            4207472616e73666572`,
        },
        {
            account: 'plasma.token',
            name: 'transfer',
            authorization: [
                {
                    actor: 'plasma.token',
                    permission: 'active',
                },
            ],
            data: {
                from: 'qzblpbxvgk3n',
                to: '1xgrbgownokr',
                quantity: '2.000000000000000000 USDP',
                memo: 'test transfer',
            },
            hex_data: `300764bb9f1acfb770219d9cb273590f19322e30303030303030303030303030303030303020555344500d74657374207
            472616e73666572`,
        },
    ],
    transaction_extensions: [] as any,
};

const serializedTx = [
    207, 119, 18, 96, 6, 154, 131, 148, 5, 149, 0, 0, 0, 0, 2, 48, 21, 164,
    25, 24, 137, 77, 172, 0, 0, 0, 87, 45, 60, 205, 205, 1, 48, 21, 164, 25,
    24, 137, 77, 172, 0, 0, 0, 0, 168, 237, 50, 50, 0, 48, 21, 164, 25, 24, 137,
    77, 172, 0, 0, 0, 87, 45, 60, 205, 205, 1, 48, 21, 164, 25, 24, 137, 77, 172, 0, 0, 0, 0, 168, 237, 50, 50, 0, 0,
];

const deserializedTx = {
    actions: [
        {
            account: 'plasma.token',
            authorization: [{ actor: 'plasma.token', permission: 'active' }],
            data: '',
            name: 'transfer',
        },
        {
            account: 'plasma.token',
            authorization: [{ actor: 'plasma.token', permission: 'active' }],
            data: '',
            name: 'transfer',
        },
    ],
    context_free_actions: [] as any,
    delay_sec: 0,
    expiration: '2021-01-28T08:37:35.000',
    max_cpu_usage_ms: 0,
    max_net_usage_words: 0,
    ref_block_num: 39430,
    ref_block_prefix: 2500170883,
    transaction_extensions: [] as any,
};

const serializedActions = [
    {
        account: 'plasma.token',
        authorization: [{ actor: 'plasma.token', permission: 'active' }],
        data: "70219D9CB273590F300764BB9F1ACFB71B312E30303030303030303030303030303030303020504C41534D410D74657374207472616E73666572", // tslint:disable-line
        name: 'transfer',
    },
    {
        account: 'plasma.token',
        authorization: [{ actor: 'plasma.token', permission: 'active' }],
        data: "300764BB9F1ACFB770219D9CB273590F19322E30303030303030303030303030303030303020555344500D74657374207472616E73666572", // tslint:disable-line
        name: 'transfer',
    },
];

const deserializedActions = [
    {
        account: 'plasma.token',
        authorization: [{ actor: 'plasma.token', permission: 'active' }],
        data: {
            from: '1xgrbgownokr',
            memo: 'test transfer',
            quantity: '1.000000000000000000 PLASMA',
            to: 'qzblpbxvgk3n',
        },
        name: 'transfer',
    },
    {
        account: 'plasma.token',
        authorization: [{ actor: 'plasma.token', permission: 'active' }],
        data: {
            from: 'qzblpbxvgk3n',
            memo: 'test transfer',
            quantity: '2.000000000000000000 USDP',
            to: '1xgrbgownokr',
        },
        name: 'transfer',
    },
];

describe('plasmajs-api', () => {
    let api: any;
    const fetch = async (input: any, init: any): Promise<any> => ({
        ok: true,
        json: async () => {
            if (input === '/v1/chain/get_raw_code_and_abi') {
                return {
                    account_name: 'plasma.token',
                    abi: "DGlvbjo6YWJpLzEuMQMIQmlnQXNzZXQJYmlnX2Fzc2V0CGFtb3VudF90BmludDEyOAdhc3NldF90CEJpZ0Fzc2V0CwdBY2NvdW50AAEHYmFsYW5jZQdhc3NldF90DEN1cnJlbmN5U3RhdAADBnN1cHBseQdhc3NldF90Cm1heF9zdXBwbHkHYXNzZXRfdAZpc3N1ZXIEbmFtZQliaWdfYXNzZXQAAwZzeW1ib2wGc3ltYm9sBmFtb3VudAhhbW91bnRfdAV2YWx1ZQZzdHJpbmcFY2xvc2UAAgVvd25lcgRuYW1lBnN5bWJvbAZzeW1ib2wGY3JlYXRlAAIGaXNzdWVyBG5hbWUObWF4aW11bV9zdXBwbHkGc3RyaW5nBWlzc3VlAAMCdG8EbmFtZQhxdWFudGl0eQZzdHJpbmcEbWVtbwZzdHJpbmcEb3BlbgADBW93bmVyBG5hbWUGc3ltYm9sBnN5bWJvbAlyYW1fcGF5ZXIEbmFtZQZyZXRpcmUAAghxdWFudGl0eQZzdHJpbmcEbWVtbwZzdHJpbmcKc3ViYmFsYW5jZQABCHF1YW50aXR5BnN0cmluZwh0cmFuc2ZlcgAEBGZyb20EbmFtZQJ0bwRuYW1lCHF1YW50aXR5BnN0cmluZwRtZW1vBnN0cmluZwd2ZXJzaW9uAAAIAAAAAACFaUQFY2xvc2UAAAAAAKhs1EUGY3JlYXRlAAAAAAAApTF2BWlzc3VlAAAAAAAAMFWlBG9wZW4AAAAAAKjrsroGcmV0aXJlAACAQtNEc47GCnN1YmJhbGFuY2UAAAAAVy08zc0IdHJhbnNmZXIAAAAAYFKHr9oHdmVyc2lvbgACAAAAOE9NETIDaTY0AAAHQWNjb3VudAAAAAAAkE3GA2k2NAAADEN1cnJlbmN5U3RhdAAAAAA==", // tslint:disable-line
                };
            }

            return transaction;
        },
    });

    beforeEach(() => {
        const rpc = new JsonRpc('', { fetch });
        // Initialize the provider with arbitrary, but a valid private key
        const signatureProvider = new JsSignatureProvider(['5JdJoNBw6xLseZ6p7AGwF1kYw36H5F9CJd32UdNpXrtSLx3CGNW']);
        const chainId = '71e44eac89b128b02ef43dd5ad6dc9955802caea5b1d321e7753722e9d16c085';
        api = new Api({
            rpc, signatureProvider, chainId, textDecoder: new TextDecoder(), textEncoder: new TextEncoder(),
        });
    });

    it('Does not crash', () => {
        expect(api).toBeTruthy();
    });

    it('getAbi returns an abi', async () => {
        const response = await api.getAbi('plasma.token');
        expect(response).toBeTruthy();
    });

    it('getTransactionAbis returns abis by transactions', async () => {
        const response = await api.getTransactionAbis(transaction);
        expect(response[0].abi.length).toBeGreaterThan(0);
    });

    it('getContract returns a contract', async () => {
        const response = await api.getContract('plasma.token');
        expect(response.actions).toBeTruthy();
    });

    it('deserializeTransaction converts tx from binary', () => {
        const tx = api.deserializeTransaction(serializedTx);
        expect(tx).toEqual(deserializedTx);
    });

    it('serializeActions converts actions to hex', async () => {
        const response = await api.serializeActions(transaction.actions);

        expect(response).toEqual(serializedActions);
    });

    it('deserializeActions converts actions from hex', async () => {
        const response = await api.deserializeActions(serializedActions);

        expect(response).toEqual(deserializedActions);
    });

    it('hasRequiredTaposFields returns true, if required fields are present', () => {
        const response = api.hasRequiredTaposFields(transaction);

        expect(response).toEqual(true);
    });
});
