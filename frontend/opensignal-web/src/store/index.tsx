import React from "react";
import Web3 from "web3";
import { getChainId } from "web3modal";
import { ACTIONS } from "./actions";

declare const window: any;
type Action = { type: string; payload?: any };
type Dispatch = (action: Action) => void;
type State = {
    chain_id: string;
    provider: any;
    wallets: string[];
    pendingTransactions: any[];
    openSignalContract: any;
    openSignalTokenContract: any;
    tokenBalance: number;
    tokenBalanceTrigger: boolean;
};
type GitcoinProviderProps = { children: React.ReactNode };
const myweb3: any = new Web3(window.ethereum);

const OPENSIGNAL_LABEL = "OpenSignal";
const TOKEN_LABEL = "OpenSignalToken";
const openSignalContract =
    process.env.REACT_APP_OPEN_SIGNAL_CONTRACT_URL || localStorage.getItem(OPENSIGNAL_LABEL) || "";
const openSignalTokenContract =
    process.env.REACT_APP_OPEN_SIGNAL_TOKEN_CONTRACT_URL || localStorage.getItem(TOKEN_LABEL) || "";
const initialState: State = {
    chain_id: getChainId(process.env.REACT_APP_NETWORK || "kovan").toString(),
    provider: myweb3.currentProvider,
    wallets: [],
    pendingTransactions: [],
    openSignalContract: openSignalContract,
    openSignalTokenContract: openSignalTokenContract,
    tokenBalance: -1,
    tokenBalanceTrigger: false,
};

const GitcoinContext = React.createContext<{
    state: State;
    dispatch: Dispatch;
}>(initialState as any);

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

const GitcoinProvider = ({ children }: GitcoinProviderProps) => {
    const [state, dispatch] = React.useReducer(gitcoinReducer, initialState);

    return (
        <GitcoinContext.Provider value={{ state, dispatch }}>{children}</GitcoinContext.Provider>
    );
};
export { GitcoinContext, GitcoinProvider };
