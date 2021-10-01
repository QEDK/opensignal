import React from 'react';
import Web3 from 'web3';
import {ACTIONS} from './actions';

declare const window: any;
type Action = {type: string; payload?: any};
type Dispatch = (action: Action) => void;
type State = {
    chain_id: string;
    provider: any;
    wallets: string[];
    pendingTransactions: any[];
    openSignalContract: any;
    openSignalTokenContract: any;
    openSignalProxyContractAddress: any,
    openSignalSharesContractAddress: any,
    tokenBalance: number;
    tokenBalanceTrigger: boolean;
    openSignalTokenContractAddress: string;
    openSignalContractAddress: string;
    rewardDistributionContractAddress: string;
};
type GitcoinProviderProps = {children: React.ReactNode};
let myweb3: any = new Web3(window.ethereum);
console.log(process.env,'env')
const OPENSIGNAL_LABEL = 'OpenSignal';
const TOKEN_LABEL = 'OpenSignalToken';
const openSignalContract =
    process.env.OPEN_SIGNAL_CONTRACT ||
    'ipfs://bafybeidpfndsm2znzdrh4s6wtauus45tfecg2376pyu73rmfajlxx2vlri/metadata.json';
const openSignalTokenContractAddress = '0x4BeD939d328c4A9B5dEcfF9668B534f44497e601';
const openSignalContractAddress = '0x3E48b1dA222561F3d6225950F482674B414C053e';
const rewardDistributionContractAddress = '0x2dd4407772b880eb02f6dd0b357e4db0a196d24e';
const openSignalTokenContract = process.env.OPEN_SIGNAL_TOKEN_CONTRACT ||
    'ipfs://bafyreiazlc7d46ylm7qsedty5hao4swre7saqkmmop4ohejzothzrr74cq/metadata.json';
const openSignalProxyContractAddress = '0x647E7265f245A6788B6f34744fe8633f60e64953';
const openSignalSharesContractAddress = '0xc268F33Bd35B28FA02De4d0C7FB5e02e3CBcE924';
const initialState: State = {
    chain_id: '42',
    provider: myweb3.currentProvider,
    wallets: [],
    pendingTransactions: [],
    openSignalContract: openSignalContract,
    openSignalTokenContract: openSignalTokenContract,
    openSignalTokenContractAddress,
    openSignalContractAddress,
    openSignalProxyContractAddress,
    openSignalSharesContractAddress,
    rewardDistributionContractAddress,
    tokenBalance: -1,
    tokenBalanceTrigger: false,
};

const GitcoinContext = React.createContext<{state: State; dispatch: Dispatch}>(
    initialState as any
);

const gitcoinReducer = (state: State, action: Action): State => {
    // console.log(action);

    switch (action.type) {
        case ACTIONS.SET_PROVIDER: {
            return {
                ...state,
                provider: action.payload,
            };
        }

        case ACTIONS.SET_WALLETS: {
            return {
                ...state,
                wallets: [...action.payload],
            };
        }
        case ACTIONS.SET_PENDINGTX: {
            return {
                ...state,
                pendingTransactions: [...action.payload],
            };
        }

        case ACTIONS.SET_CHAIN_ID: {
            return {
                ...state,
                chain_id: action.payload,
                provider: myweb3.currentProvider,
            };
        }
        case ACTIONS.SET_OPENSIGNAL_URL: {
            return {
                ...state,
                openSignalContract: action.payload,
            };
        }
        case ACTIONS.SET_OPENSIGNALTOKEN_URL: {
            return {
                ...state,
                openSignalTokenContract: action.payload,
            };
        }
        case ACTIONS.SET_TOKEN_BALANCE: {
            return {
                ...state,
                tokenBalance: action.payload,
            };
        }
        case ACTIONS.TOKEN_BALANCE_TRIGGER: {
            return {
                ...state,
                tokenBalanceTrigger: !state.tokenBalanceTrigger,
            };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};

const GitcoinProvider = ({children}: GitcoinProviderProps) => {
    const [state, dispatch] = React.useReducer(gitcoinReducer, initialState);

    return (
        <GitcoinContext.Provider value={{state, dispatch}}>
            {children}
        </GitcoinContext.Provider>
    );
};
export {GitcoinContext, GitcoinProvider};
