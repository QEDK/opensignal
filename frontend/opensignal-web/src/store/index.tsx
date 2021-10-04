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
    openSignalProxyContractAddress: any;
    openSignalSharesContractAddress: any;
    tokenBalance: number;
    tokenBalanceTrigger: boolean;
    openSignalTokenContractAddress: string;
    openSignalContractAddress: string;
    rewardDistributionContractAddress: string;
};
type GitcoinProviderProps = { children: React.ReactNode };
const myweb3: any = new Web3(window.ethereum);
console.log(process.env, "env");
const OPENSIGNAL_LABEL = "OpenSignal";
const TOKEN_LABEL = "OpenSignalToken";
const openSignalContract =
    process.env.OPEN_SIGNAL_CONTRACT ||
    "ipfs://bafybeidpfndsm2znzdrh4s6wtauus45tfecg2376pyu73rmfajlxx2vlri/metadata.json";
const openSignalTokenContractAddress = "0x4BeD939d328c4A9B5dEcfF9668B534f44497e601";
const openSignalContractAddress = "0x5627C20EA760C9d0a0FD19261BB2A0f772eeaDDC";
const rewardDistributionContractAddress = "0x70513ADbeA3CB433290F156da8803Cc32E57fda8";
const openSignalTokenContract =
    process.env.OPEN_SIGNAL_TOKEN_CONTRACT ||
    "ipfs://bafyreiazlc7d46ylm7qsedty5hao4swre7saqkmmop4ohejzothzrr74cq/metadata.json";
const openSignalProxyContractAddress = "0x647E7265f245A6788B6f34744fe8633f60e64953";
const openSignalSharesContractAddress = "0x8343B63D911FaC972E9F45441808eA48d84450B6";
const initialState: State = {
    chain_id: getChainId(process.env.REACT_APP_NETWORK || "kovan").toString(),
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
