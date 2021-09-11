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
    tokenBalance: number;
};
type GitcoinProviderProps = {children: React.ReactNode};
let myweb3: any = new Web3(window.ethereum);

const OPENSIGNAL_LABEL = 'OpenSignal';
const TOKEN_LABEL = 'OpenSignalToken';
const openSignalContract =
    localStorage.getItem(OPENSIGNAL_LABEL) ||
    'ipfs://bafyreibraij4zlc7wt52duyr5enkmglpooh4iimanh4ftxs2gar55z24re/metadata.json';
const openSignalTokenContract =
    localStorage.getItem(TOKEN_LABEL) ||
    'ipfs://bafyreiazlc7d46ylm7qsedty5hao4swre7saqkmmop4ohejzothzrr74cq/metadata.json';
const initialState: State = {
    chain_id: '42',
    provider: myweb3.currentProvider,
    wallets: [],
    pendingTransactions: [],
    openSignalContract: openSignalContract,
    openSignalTokenContract: openSignalTokenContract,
    tokenBalance: -1,
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
            localStorage.setItem(OPENSIGNAL_LABEL, action.payload);
            return {
                ...state,
                openSignalContract: action.payload,
            };
        }
        case ACTIONS.SET_OPENSIGNALTOKEN_URL: {
            localStorage.setItem(TOKEN_LABEL, action.payload);
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
