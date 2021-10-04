import React from "react";

import MetamaskIcon from "../assets/icons/metamask.png";

import { useGetBalance } from "../../hooks/Balance.hook";
import { useGetOpenSignalTokenContract } from "../../hooks/Contract.hook";
import { useGetTokenBalance } from "../../hooks/OpenSignalToken.hook";
import { GitcoinContext } from "../../store";
import { ACTIONS } from "../../store/actions";
import { minimizeAddress, getNetworkName } from "../../util/eth.util";
import Image from "next/image";

export const WalletComponent = () => {
  const { state, dispatch } = React.useContext(GitcoinContext);
  const [tokenContract] = useGetOpenSignalTokenContract(
    state.openSignalTokenContractAddress
  );
  const balance = useGetBalance(state.wallets[0], state.provider);
  const [tokenBalance, tokenBalanceLoading] = useGetTokenBalance(
    state.wallets[0],
    tokenContract,
    state.tokenBalanceTrigger
  );

  React.useEffect(() => {
    dispatch({
      type: ACTIONS.SET_TOKEN_BALANCE,
      payload:
        tokenBalance != null && tokenBalance > 0 ? Number(tokenBalance) : -1,
    });
  }, [tokenBalance, tokenBalanceLoading, dispatch]);

  React.useEffect(() => {
    requestSwitchNetwork();
  }, []);
  const requestSwitchNetwork = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4" }],
    });
  };
  const onMetamaskConnect = async () => {
    const permissions = await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");

    dispatch({
      type: "SET_WALLETS",
      payload: [],
    });
  };
  return (
    <div className="wallet">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginLeft: 8, textAlign: "center" }}>{`Token ${
          tokenBalanceLoading ? "0" : tokenBalance
        }`}</div>
        <div
          style={{ marginLeft: 8, textAlign: "center" }}
        >{`三 ${balance}`}</div>
      </div>
      {state.wallets[0] ? (
        <button className="address">
          <h3> {minimizeAddress(state.wallets[0])}</h3>
        </button>
      ) : (
        <button className="address" onClick={onMetamaskConnect}>
          <h3>{`Connect`}</h3>
        </button>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <span>{getNetworkName(state.chain_id)}</span>
        </div>
        <div onClick={onMetamaskConnect} className={"wallet-btn"}>
          <Image alt="wallet" src={MetamaskIcon} />
        </div>
        {getNetworkName(state.chain_id) != "Rinkeby" ? (
          <div>WRONG NETWORK PLEASE SWITCH TO RINKEBY </div>
        ) : null}
      </div>
    </div>
  );
};
