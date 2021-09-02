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
};
type GitcoinProviderProps = {children: React.ReactNode};
let myweb3: any = new Web3(window.ethereum);
const initialState: State = {
    chain_id: '42',
    provider: myweb3.currentProvider,
    wallets: [],
    pendingTransactions: [],
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
