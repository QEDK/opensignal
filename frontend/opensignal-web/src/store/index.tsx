import React from 'react';
import Web3 from 'web3';

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
};
type GitcoinProviderProps = {children: React.ReactNode};
let myweb3: any = new Web3(window.ethereum);

const OPENSIGNAL_LABEL = 'OpenSignal';
const TOKEN_LABEL = 'OpenSignalToken';
const openSignalContract =
    localStorage.getItem(OPENSIGNAL_LABEL) ||
    'ipfs://bafyreiaws6ptz3lp5w6fg2nwohstn7nxkiarnxlv4lnmgv3e7bxfat42ji/metadata.json';
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
};

const GitcoinContext = React.createContext<{state: State; dispatch: Dispatch}>(
    initialState as any
);

const gitcoinReducer = (state: State, action: Action): State => {
    // console.log(action);

    switch (action.type) {
        case 'SET_PROVIDER': {
            return {
                ...state,
                provider: action.payload,
            };
        }

        case 'SET_WALLETS': {
            return {
                ...state,
                wallets: [...action.payload],
            };
        }
        case 'SET_PENDINGTX': {
            return {
                ...state,
                pendingTransactions: [...action.payload],
            };
        }

        case 'SET_CHAIN_ID': {
            return {
                ...state,
                chain_id: action.payload,
                provider: myweb3.currentProvider,
            };
        }
        case 'SET_OPENSIGNAL_URL': {
            localStorage.setItem(OPENSIGNAL_LABEL, action.payload);
            return {
                ...state,
                openSignalContract: action.payload,
            };
        }
        case 'SET_OPENSIGNALTOKEN_URL': {
            console.log('action.payload', action.payload);
            localStorage.setItem(TOKEN_LABEL, action.payload);
            return {
                ...state,
                openSignalTokenContract: action.payload,
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
