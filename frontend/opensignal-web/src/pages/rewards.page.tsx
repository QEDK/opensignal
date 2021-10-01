import {Container, Grid, Button, Icon} from 'semantic-ui-react';
import {useHistory} from 'react-router';
//@ts-ignore
import makeBlockie from 'ethereum-blockies-base64';
import {BigNumber} from 'ethers';
import {
    useGetOpenSignalContract,
    useGetOpenSignalTokenContract,
} from '../hooks/Contract.hook';
import {GitcoinContext} from '../store';
import React from 'react';
import Web3 from 'web3';
import {useGetMetadata} from '../hooks/Ipfs.hook';
import {useGetProjectIds, useGetProjects} from '../hooks/OpenSignal.hook';
const RewardsPage = () => {
    const {state} = React.useContext(GitcoinContext);
    const [trigger, settrigger] = React.useState<boolean>(false);
    const history = useHistory();
    // const [opensignalMeta] = useGetMetadata(state.openSignalContract);
    const [openSignalContract] = useGetOpenSignalContract(state.openSignalContractAddress);
    const [tokenMeta] = useGetMetadata(state.openSignalTokenContractAddress);
    const [tokenContract] = useGetOpenSignalTokenContract(tokenMeta);
    const [ids] = useGetProjectIds(openSignalContract, trigger);
    const [projects, projectsLoading, e] = useGetProjects(
        ids,
        openSignalContract
    );
  async function getRewardContractAddress() {
        console.log(openSignalContract,'oss')
        await openSignalContract.methods['0x0c7d5cd8']
            .then(console.log)
            .catch(console.log);
    }
    return (
        <div className="project">
           <button onClick={getRewardContractAddress}>get Reward Contract</button>
        </div>
    );
};

export {RewardsPage};

const ProjectCard = ({project}: {project: Project}) => {
    const {state} = React.useContext(GitcoinContext);
    const [openSignalContract] = useGetOpenSignalContract(
        state.openSignalContract
    );
    const OnIncreaseSignal = () => {
        openSignalContract.methods
            .addSignal(state.wallets[0], BigNumber.from(10).pow(18))
            .send({
                from: state.wallets[0],
            })
            .then(console.log)
            .catch(console.log);
    };
    const OnDecreaseSignal = () => {
        openSignalContract.methods
            .removeSignal(state.wallets[0], BigNumber.from(10).pow(18))
            .send({
                from: state.wallets[0],
            })
            .then(console.log)
            .catch(console.log);
    };

    async function getRewardContractAddress() {
        console.log(openSignalContract,'oss')
        await openSignalContract.methods.rewardsDistribution()
            .then(console.log)
            .catch(console.log);
    }
    return (
        <div className="project">
           <button onClick={getRewardContractAddress}>get Reward Contract</button>
        </div>
    );
};
