import {Container, Grid, Button, Icon, Input} from 'semantic-ui-react';
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
import {
    useGetProjectIds,
    useGetProjects,
    useGetProjectURI,
} from '../hooks/OpenSignal.hook';
import {useGetMetadata} from '../hooks/Ipfs.hook';
import {BouncyBalls} from '../components/util.component';
import {isAddress, minimizeAddress} from '../util/eth.util';
import Web3 from 'web3';
import {useGetAllowance} from '../hooks/Token.hook';
const ProjectPage = () => {
    const {state} = React.useContext(GitcoinContext);
    const [trigger, settrigger] = React.useState<boolean>(false);
    const history = useHistory();
    const [opensignalMeta] = useGetMetadata(state.openSignalContract);
    const [openSignalContract] = useGetOpenSignalContract(opensignalMeta);
    const [tokenMeta] = useGetMetadata(state.openSignalTokenContract);
    const [tokenContract] = useGetOpenSignalTokenContract(tokenMeta);
    const [ids] = useGetProjectIds(openSignalContract, trigger);
    const [projects, projectsLoading, e] = useGetProjects(
        ids,
        openSignalContract
    );

    const goToNewProject = () => {
        history.push('/projects/new');
    };

    return (
        <Container>
            <div className="page-header">
                <h3>Projects</h3>

                <span className="btn" onClick={goToNewProject}>
                    CREATE
                </span>
            </div>

            <Grid
                textAlign="center"
                verticalAlign="middle"
                style={{
                    marginTop: '2rem',
                }}
            >
                <div className="projects">
                    {projectsLoading ? <BouncyBalls /> : null}
                    {projects.map((p: any, i: any) => (
                        <ProjectCard
                            project={p}
                            key={i}
                            contract={openSignalContract}
                            opensignalMeta={opensignalMeta}
                            tokenContract={tokenContract}
                            onChange={() => settrigger(!trigger)}
                        />
                    ))}
                </div>
            </Grid>
        </Container>
    );
};

export {ProjectPage};

const ProjectCard = ({
    project,
    contract,
    opensignalMeta,
    tokenContract,
    onChange,
}: {
    project: Project;
    contract: any;
    opensignalMeta: any;
    tokenContract: any;
    onChange: () => void;
}) => {
    const {state} = React.useContext(GitcoinContext);
    const [approveLoading, setApproveLoading] = React.useState<boolean>(false);
    const [createLoading, setCreateLoading] = React.useState<boolean>(false);
    const [amount, setAmount] = React.useState(0);

    const [projectURI] = useGetProjectURI(project.id, contract);
    const [projectMeta, projectMetaLoading] = useGetMetadata(projectURI);

    const [allowance, allowanceLoading, allowanceErr] = useGetAllowance(
        state.wallets[0],
        tokenContract,
        opensignalMeta,
        approveLoading
    );

    const OnIncreaseSignal = () => {
        console.log(
            !notEnoughAllowance,
            contract,
            isAddress(contract._address)
        );
        if (!notEnoughAllowance && contract && isAddress(contract._address)) {
            setCreateLoading(true);
            contract.methods
                .addSignal(project.id, Web3.utils.toWei(amount.toString()))
                .send({
                    from: state.wallets[0],
                })
                .then((res: any) => {
                    setCreateLoading(false);
                })
                .catch((err: any) => {
                    setCreateLoading(false);
                    console.log(err);
                });
        }
    };
    const OnDecreaseSignal = () => {
        if (!notEnoughAllowance && contract && isAddress(contract._address)) {
            setCreateLoading(true);
            contract.methods
                .removeSignal(
                    project.id,
                    Web3.utils.toWei(amount.toString()),
                    Web3.utils.toWei((amount * 0.95).toString())
                )
                .send({
                    from: state.wallets[0],
                })
                .then((res: any) => {
                    onChange();
                    setCreateLoading(false);
                })
                .catch((err: any) => {
                    setCreateLoading(false);
                    console.log(err);
                });
        }
    };

    const onApprove = () => {
        if (notEnoughAllowance) {
            setApproveLoading(true);
            tokenContract.methods
                .approve(
                    opensignalMeta.properties.address,
                    Web3.utils.toWei(amount.toString())
                )
                .send({
                    from: state.wallets[0],
                })
                .then((res: any) => {
                    onChange();
                    setApproveLoading(false);
                })
                .catch((err: any) => {
                    setApproveLoading(false);
                    console.log(err);
                });
            return;
        }
    };

    const notEnoughAllowance = BigNumber.from(allowance).lt(
        BigNumber.from(amount).mul(BigNumber.from(10).pow(18))
    );
    return (
        <div className="project">
            <div className="project-avatar">
                <img src={project.avatar} />
            </div>
            <div className="project-info">
                <div className="project-header">
                    <h3>{`${
                        projectMetaLoading
                            ? 'Loading'
                            : projectMeta?.name || 'Loading'
                    } (${minimizeAddress(project.creator)})`}</h3>
                    <p>{`Deployment: ${project.deployment}`}</p>
                </div>{' '}
                <div className="project-subheader">
                    <div className="project-actions">
                        <Input
                            className="signal-amount"
                            value={amount || undefined}
                            placeholder={'Enter Amount'}
                            onChange={(e) =>
                                setAmount(
                                    Number(e.target.value) > 0
                                        ? Number(e.target.value)
                                        : 0
                                )
                            }
                        />
                        {amount != 0 && notEnoughAllowance ? (
                            <Button.Group size="large">
                                <Button
                                    loading={approveLoading}
                                    onClick={() => onApprove()}
                                    className="signal-approve"
                                >
                                    APPROVE
                                </Button>
                            </Button.Group>
                        ) : (
                            <Button.Group size="large">
                                <Button
                                    onClick={() => OnIncreaseSignal()}
                                    loading={createLoading}
                                >
                                    <Icon name="angle up" />
                                </Button>

                                <Button
                                    onClick={() => OnDecreaseSignal()}
                                    loading={createLoading}
                                >
                                    <Icon name="angle down" />
                                </Button>
                            </Button.Group>
                        )}
                    </div>
                    <div className="project-signal">
                        <p>
                            {`Signal: `}{' '}
                            <span>
                                {`Ξ ${Web3.utils.fromWei(
                                    project.signal.toString()
                                )} `}
                            </span>
                        </p>
                        <p>
                            {`Staked: `}{' '}
                            <span>
                                {`Ξ ${Web3.utils.fromWei(
                                    project.selfStake.toString()
                                )} `}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
