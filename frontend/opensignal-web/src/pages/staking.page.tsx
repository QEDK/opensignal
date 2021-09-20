import { Container, Grid, Button, Icon } from "semantic-ui-react";
import { useHistory } from "react-router";
import { BigNumber } from "ethers";
import { useGetOpenSignalContract, useGetOpenSignalTokenContract } from "../hooks/Contract.hook";
import { GitcoinContext } from "../store";
import React from "react";
import Web3 from "web3";
import { useGetMetadata } from "../hooks/Ipfs.hook";
import { useGetProjectIds, useGetProjects } from "../hooks/OpenSignal.hook";
const StakingPage = () => {
    const { state } = React.useContext(GitcoinContext);
    const [trigger, settrigger] = React.useState<boolean>(false);
    const history = useHistory();
    const [opensignalMeta] = useGetMetadata(state.openSignalContract);
    const [openSignalContract] = useGetOpenSignalContract(opensignalMeta);
    const [tokenMeta] = useGetMetadata(state.openSignalTokenContract);
    const [tokenContract] = useGetOpenSignalTokenContract(tokenMeta);
    const [ids] = useGetProjectIds(openSignalContract, trigger);
    const [projects, projectsLoading, e] = useGetProjects(ids, openSignalContract);
    return (
        <Container>
            <div className="page-header">
                <h3>Projects</h3>
            </div>

            <Grid
                textAlign="center"
                verticalAlign="middle"
                style={{
                    marginTop: "2rem",
                }}
            >
                <div className="staking-projects">
                    {projects.map((p: any, i: any) => (
                        <ProjectCard project={p} key={i} />
                    ))}
                </div>
            </Grid>
        </Container>
    );
};

export { StakingPage };

const ProjectCard = ({ project }: { project: Project }) => {
    const { state } = React.useContext(GitcoinContext);
    const [openSignalContract] = useGetOpenSignalContract(state.openSignalContract);
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
    return (
        <div className="project">
            <h3 style={{ backgroundColor: "#434547" }}>{project.name}</h3>

            <div className="project-avatar">
                <img src={project.avatar} />
            </div>
            <div className="project-actions">
                <Button.Group size="large">
                    <Button onClick={() => OnIncreaseSignal()}>
                        <Icon name="angle up" />
                    </Button>

                    <Button onClick={() => OnDecreaseSignal()}>
                        <Icon name="angle down" />
                    </Button>
                </Button.Group>
            </div>
            <div className="project-subheader">
                <p>
                    {`Signal: `} <span>{Web3.utils.fromWei(project.signal.toString())}</span>
                </p>
                <p>
                    {`Staked: `} <span>{Web3.utils.fromWei(project.selfStake.toString())}</span>
                </p>
            </div>
        </div>
    );
};
