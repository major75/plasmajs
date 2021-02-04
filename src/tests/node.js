const { JsonRpc, RpcError, Api } = require('../../dist');
const { JsSignatureProvider } = require('../../dist/plasmajs-jssig');
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');

const privateKey = '5KZovMkn6vVkCVNpoE3kZdiRXmbyaKCGsikPdzP4mDXzQqdUCVd'; // aaaaaaaaaaab account private key
/* new accounts for testing can be created by unlocking a sol wallet then calling:
 * 1) sol create key --to-console (copy this privateKey & publicKey)
 * 2) sol wallet import
 * 3) sol create account bob publicKey
 * 4) sol create account alice publicKey
 */

const rpc = new JsonRpc('http://localhost:8888', { fetch });
const signatureProvider = new JsSignatureProvider([privateKey]);
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const plasmaTokenAbi = async () => await api.getAbi("plasma.token");

const transactWithConfig = async () => await api.transact({
    actions: [{
        account: 'plasmap',
        name: 'version',
        authorization: [{
            actor: 'aaaaaaaaaaab',
            permission: 'active',
        }],
        data: {},
    }]
}, {
    blocksBehind: 3,
    expireSeconds: 30,
});

const transactWithoutConfig = async () => {
    const transactionResponse = await transactWithConfig();
    const blockInfo = await rpc.get_block(transactionResponse.processed.block_num - 3);
    const currentDate = new Date();
    const timePlusTen = currentDate.getTime() + 10000;
    const timeInISOString = (new Date(timePlusTen)).toISOString();
    const expiration = timeInISOString.substr(0, timeInISOString.length - 1);

    return await api.transact({
        expiration,
        ref_block_num: blockInfo.block_num & 0xffff,
        ref_block_prefix: blockInfo.ref_block_prefix,
        actions: [{
            account: 'plasmap',
            name: 'version',
            authorization: [{
                actor: 'aaaaaaaaaaab',
                permission: 'active',
            }],
            data: {},
        }]
    });
};
    

const transactWithoutBroadcast = async () => await api.transact({
    actions: [{
        account: 'eurp',
        name: 'transfer',
        authorization: [{
            actor: 'aaaaaaaaaaab',
            permission: 'active',
        }],
        data: {
            from: 'aaaaaaaaaaab',
            to: 'aaaaaaaaaaac',
            quantity: '2',
            paySysCms: true,
            memo: 'build test',
        },
    }]
}, {
    broadcast: false,
    blocksBehind: 3,
    expireSeconds: 30,
});

const broadcastResult = async (signaturesAndPackedTransaction) => await api.pushSignedTransaction(signaturesAndPackedTransaction);

const transactShouldFail = async () => await api.transact({
    actions: [{
        account: 'eurp',
        name: 'transfer',
        authorization: [{
            actor: 'aaaaaaaaaaab',
            permission: 'active',
        }],
        data: {
            from: 'aaaaaaaaaaab',
            to: 'aaaaaaaaaaac',
            quantity: '2',
            paySysCms: true,
            memo: 'build test',
        },
    }]
});
  
const rpcShouldFail = async () => await rpc.get_block(-1);

module.exports = {
    plasmaTokenAbi,
    transactWithConfig,
    transactWithoutConfig,
    transactWithoutBroadcast,
    broadcastResult,
    transactShouldFail,
    rpcShouldFail
};
