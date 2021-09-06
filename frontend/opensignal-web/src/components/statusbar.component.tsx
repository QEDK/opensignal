import React from 'react';

import {useGetBalance} from '../hooks/Balance.hook';
import {GitcoinContext} from '../store';

import MetamaskIcon from '../assets/icons/metamask.png';

import {minimizeAddress, getNetworkName} from '../util/eth.util';
import {NavLink} from 'react-router-dom';

const StatusbarComponent = () => {
    const {state, dispatch} = React.useContext(GitcoinContext);

    return (
        <div className={'nav-bar'}>
            <div className={'nav'}>
                <div className="nav-item">
                    {' '}
                    <NavLink to="/">Projects</NavLink>
                </div>{' '}
                <div className="nav-item">
                    {' '}
                    <NavLink to="/staking">Staking</NavLink>
                </div>{' '}
                <div className="nav-item">
                    {' '}
                    <NavLink to="/token">Token</NavLink>
                </div>{' '}
                <div className="nav-item">
                    {' '}
                    <NavLink to="/guide">Guide</NavLink>
                </div>{' '}
                <div className="nav-item">
                    {' '}
                    <NavLink to="/deploy">Deploy</NavLink>
                </div>
            </div>

            <WalletComponent />
        </div>
    );
};

export {StatusbarComponent};

const WalletComponent = () => {
    const {state, dispatch} = React.useContext(GitcoinContext);
    const [open, setopen] = React.useState(false);
    const balance = useGetBalance(state.wallets[0], state.provider);

    const onMetamaskConnect = async () => {
        const permissions = await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [
                {
                    eth_accounts: {},
                },
            ],
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('profile');

        dispatch({
            type: 'SET_WALLETS',
            payload: [],
        });
    };
    return (
        <div className="wallet">
            {state.wallets[0] ? (
                <button className="address">
                    <span>{`三 ${balance}`}</span>
                    <h3> {minimizeAddress(state.wallets[0])}</h3>
                    <span>{getNetworkName(state.chain_id)}</span>
                </button>
            ) : (
                <button className="address" onClick={onMetamaskConnect}>
                    <h3>{`Connect`}</h3>
                    <span>{getNetworkName(state.chain_id)}</span>
                </button>
            )}
            <div onClick={onMetamaskConnect} className={'wallet-btn'}>
                <img alt="wallet" src={MetamaskIcon} />
            </div>
        </div>
    );
};
