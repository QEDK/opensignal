import * as React from 'react';
import {Tracing} from 'trace_events';
declare const window: any;
type Action = {type: string; payload?: any};
type Dispatch = (action: Action) => void;
type State = {
    chain_id: string;
    connection_status: number;
    profile: {name: string; user_id: string; address: string};
    token: string;
};
type GitcoinProviderProps = {children: React.ReactNode};
const initialState: State = {
    chain_id: '42',
    connection_status: 0,
    profile: {name: '', user_id: '', address: ''},
    token: '',
};

const MyContext = React.createContext<{state: State; dispatch: Dispatch}>(
    initialState as any
);

const gitcoinReducer = (state: State, action: Action): State => {
    console.log(action);

    switch (action.type) {
        case 'SET_CONNECTION_STATUS': {
            return {...state, connection_status: action.payload};
        }
        case 'SET_TOKEN': {
            return {...state, token: action.payload};
        }
        case 'SET_PROFILE': {
            return {...state, profile: action.payload};
        }
        case 'SET_CHAIN_ID': {
            return {
                ...state,
                chain_id: action.payload,
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
        <MyContext.Provider value={{state, dispatch}}>
            {children}
        </MyContext.Provider>
    );
};
export {MyContext, GitcoinProvider};

const _getNetworkName = (id: string) => {
    switch (id) {
        case '1':
            return 'Mainnet';
        case '5':
            return 'Goerli';
        case '3':
            return 'Ropsten';
        case '4':
            return 'Rinkeby';
        case '42':
            return 'Kovan';
        default:
            return 'Kovan'; //TODO
    }
};
