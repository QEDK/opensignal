import React from "react";
import Web3 from "web3";

import { Container } from "semantic-ui-react";
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect } from "react-router-dom";

import { ProjectNewPage } from "./project-new.page";
import { ProjectPage } from "./projects.page";
import { GuidePage } from "./guide";
import { StakingPage } from "./staking.page";

import { GitcoinContext } from "../store";
import { StatusbarComponent } from "../components";
import { TokenPage } from "./token.page";
import { DeployPage } from "./deploy.page";

const Pages = () => {
    const { dispatch } = React.useContext(GitcoinContext);

    const handleAccountsChanged = (accounts: string[]) => {
        dispatch({
            type: "SET_WALLETS",
            payload: accounts,
        });
        const myweb3 = new Web3(window.ethereum);
        dispatch({
            type: "SET_PROVIDER",
            payload: myweb3.currentProvider,
        });
    };

    const handleChainChanged = (chainId: number) => {
        dispatch({
            type: "SET_CHAIN_ID",
            payload: parseInt(chainId.toString(), 16).toString(),
        });
    };
    const _stup = async () => {
        if (!window.ethereum) {
            return;
        }

        window.ethereum
            .request({
                method: "eth_accounts",
            })
            .then(handleAccountsChanged)
            .catch((err: any) => console.error(err));

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
        const myweb3 = new Web3(window.ethereum);
        dispatch({
            type: "SET_CHAIN_ID",
            payload: (await myweb3.eth.net.getId()).toString(),
        });
    };

    React.useEffect(() => {
        _stup();

        return () => {
            if (window.ethereum.removeListener) {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
                window.ethereum.removeListener("chainChanged", handleChainChanged);
            }
        };
    }, []);

    return (
        <Container className="root" style={{ width: "100%" }}>
            <Router>
                <Container className={"app"} fluid={true}>
                    <div className={"page-container"}>
                        <StatusbarComponent />
                        <Container style={{ marginTop: "1em" }}>
                            <Switch>
                                <Route path={"/"} exact={true} component={ProjectPage} />
                                <Route
                                    path={"/projects/new"}
                                    exact={true}
                                    component={ProjectNewPage}
                                />{" "}
                                <Route path={"/token"} exact={true} component={TokenPage} />{" "}
                                <Route path={"/staking"} exact={true} component={StakingPage} />{" "}
                                <Route path={"/guide"} exact={true} component={GuidePage} />{" "}
                                <Route path={"/deploy"} exact={true} component={DeployPage} />
                            </Switch>
                        </Container>
                    </div>
                </Container>
            </Router>
        </Container>
    );
};
export default Pages;
