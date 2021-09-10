import {Container, Grid, Button, Icon, Input} from 'semantic-ui-react';
import {Header, Image, Modal} from 'semantic-ui-react';

import {useHistory} from 'react-router';
//@ts-ignore
import makeBlockie from 'ethereum-blockies-base64';
import {BigNumber} from 'ethers';
import {
    useGetOpenSignalContract,
    useGetOpenSignalTokenContract,
    useGetOpenSignalShareContract,
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
import {useGetAllowance} from '../hooks/OpenSignalToken.hook';
const re = /^[0-9\b]+$/;
const pat = /^((http|https):\/\/)/;
const ProjectPage = () => {
    const {state} = React.useContext(GitcoinContext);
    const [trigger, settrigger] = React.useState<boolean>(false);
    const [createLoading, setCreateLoading] = React.useState<boolean>(false);
    const [selectedProject, setSelectedProject] =
        React.useState<Project | null>(null);
    const [addSignalModal, setAddSignalModal] = React.useState<boolean>(false);
    const [approveLoading, setApproveLoading] = React.useState<boolean>(false);
    const [removeSignalModal, setRemoveSignalModal] =
        React.useState<boolean>(false);
    const history = useHistory();
    const [opensignalMeta] = useGetMetadata(state.openSignalContract);
    const [openSignalContract] = useGetOpenSignalContract(opensignalMeta);
    const [tokenMeta] = useGetMetadata(state.openSignalTokenContract);
    const [tokenContract] = useGetOpenSignalTokenContract(tokenMeta);
    const [shareContract] = useGetOpenSignalShareContract();
    const [ids] = useGetProjectIds(openSignalContract, trigger);
    const [projects, projectsLoading, e] = useGetProjects(
        ids,
        openSignalContract
    );
    const [allowance, allowanceLoading, allowanceErr] = useGetAllowance(
        state.wallets[0],
        tokenContract,
        opensignalMeta,
        approveLoading
    );
    const goToNewProject = () => {
        history.push('/projects/new');
    };

    const onApprove = (amount: number) => {
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
                setApproveLoading(false);
            })
            .catch((err: any) => {
                setApproveLoading(false);
                console.log(err);
            });
        return;
    };

    const OnIncreaseSignal = (project: Project | null, amount: number) => {
        console.log('project12', project);
        if (
            project &&
            openSignalContract &&
            isAddress(openSignalContract._address) &&
            amount > 0
        ) {
            setCreateLoading(true);
            openSignalContract.methods
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

    const OnDecreaseSignal = (project: Project | null, amount: number) => {
        console.log('project1', project);
        if (
            project &&
            openSignalContract &&
            isAddress(openSignalContract._address) &&
            amount > 0
        ) {
            setCreateLoading(true);
            openSignalContract.methods
                .removeSignal(
                    project.id,
                    Web3.utils.toWei(amount.toString()),
                    Web3.utils.toWei((amount * 0.95).toString())
                )
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
                            onClick={() => setSelectedProject(p)}
                            contract={openSignalContract}
                            opensignalMeta={opensignalMeta}
                            tokenContract={tokenContract}
                            onChange={() => settrigger(!trigger)}
                            setApproveLoading={setApproveLoading}
                            setAddSignalModal={setAddSignalModal}
                            setRemoveSignalModal={setRemoveSignalModal}
                        />
                    ))}
                </div>
            </Grid>

            <AddSignalModal
                open={addSignalModal}
                onVisibilityChange={setAddSignalModal}
                allowance={allowance}
                onApprove={onApprove}
                approveLoading={approveLoading}
                OnIncreaseSignal={OnIncreaseSignal}
                project={selectedProject}
            />
            <RmoveSignalModal
                open={removeSignalModal}
                onVisibilityChange={setRemoveSignalModal}
                OnDecreaseSignal={OnDecreaseSignal}
                project={selectedProject}
            />
        </Container>
    );
};

export {ProjectPage};

const ProjectCard = ({
    project,
    contract,
    setAddSignalModal,
    setRemoveSignalModal,
    onClick,
}: {
    project: Project;
    contract: any;
    opensignalMeta: any;
    tokenContract: any;
    onChange: () => void;
    setApproveLoading: (i: boolean) => void;
    setAddSignalModal: (i: boolean) => void;
    setRemoveSignalModal: (i: boolean) => void;
    onClick: (p: Project) => void;
}) => {
    const {state} = React.useContext(GitcoinContext);

    const [projectURI] = useGetProjectURI(project.id, contract);
    const [projectMeta, projectMetaLoading] = useGetMetadata(projectURI);
    // console.log('projectURI', projectURI);
    // console.log('projectMeta', projectMeta);

    return (
        <div className="project" onClick={() => onClick(project)}>
            <div className="project-avatar">
                <img
                    object-fit="cover"
                    src={
                        projectMeta?.avatar
                            ? projectMeta.avatar
                            : project.avatar
                    }
                />
                <div className="project-avatar-sub">
                    <Button.Group size="large">
                        <Button onClick={() => setAddSignalModal(true)}>
                            <Icon name="angle up" />
                        </Button>

                        <Button onClick={() => setRemoveSignalModal(true)}>
                            <Icon name="angle down" />
                        </Button>
                    </Button.Group>
                </div>
            </div>
            <div className="project-info">
                <div className="project-header">
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <h3>
                            {`${
                                projectMetaLoading
                                    ? 'Loading'
                                    : projectMeta?.properties.name || 'Loading'
                            }`}
                        </h3>
                        {projectMeta?.properties.link ? (
                            <a
                                style={{padding: 8}}
                                href={
                                    pat.test(projectMeta?.properties.link)
                                        ? projectMeta?.properties.link
                                        : 'https://' +
                                          projectMeta?.properties.link
                                }
                                target="_blank"
                            >
                                <Icon name="external alternate" />
                                website
                            </a>
                        ) : null}

                        {projectMeta?.properties.twitter ? (
                            <a
                                style={{padding: 8}}
                                href={
                                    pat.test(projectMeta?.properties.twitter)
                                        ? projectMeta?.properties.twitter
                                        : 'https://' +
                                          projectMeta?.properties.twitter
                                }
                                target="_blank"
                            >
                                <Icon name="twitter" />
                                twitter
                            </a>
                        ) : null}
                    </div>
                    <p style={{margin: 0}}>{`ID: ${project.id}`}</p>
                    <p
                        style={{margin: 0}}
                    >{`Deployment: ${project.deployment}`}</p>
                    <p style={{margin: 0}}>{`Creator: ${project.creator}`}</p>
                </div>

                <div style={{padding: 8, flex: 1}}>
                    <p
                        style={{
                            display: 'inline-block',
                            paddingRight: 12,
                            margin: 0,
                        }}
                    >{`${projectMeta?.properties.description}`}</p>
                </div>

                <div className="project-subheader">
                    <div className="project-actions"></div>
                    <div className="project-signal">
                        <p>
                            {`Signal: `}
                            <span>
                                {`Ξ ${Web3.utils.fromWei(
                                    project.signal.toString()
                                )} `}
                            </span>
                        </p>
                        <p>
                            {`Staked: `}
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

const AddSignalModal = ({
    open,
    onVisibilityChange,
    OnIncreaseSignal,
    project,
    onApprove,
    allowance,
    approveLoading,
}: {
    open: boolean;
    onVisibilityChange: (i: boolean) => void;
    OnIncreaseSignal: (project: Project | null, amount: number) => void;
    project: Project | null;
    onApprove: (amount: number) => void;
    allowance: number;
    approveLoading: boolean;
}) => {
    const [amount, setAmount] = React.useState(0);

    const notEnoughAllowance = BigNumber.from(allowance).lt(
        BigNumber.from(amount).mul(BigNumber.from(10).pow(18))
    );

    return (
        <Modal
            onClose={() => onVisibilityChange(false)}
            onOpen={() => onVisibilityChange(true)}
            open={open}
        >
            <Modal.Header>Add Signal</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Header>Select the amount</Header>
                    <Input
                        style={{width: '100%'}}
                        type="number"
                        className="signal-amount"
                        value={amount || ''}
                        placeholder={'Enter Amount'}
                        onChange={(e) =>
                            setAmount(
                                e.target.value == '' ||
                                    (re.test(e.target.value) &&
                                        Number(e.target.value) < 1e15)
                                    ? Number(e.target.value)
                                    : Number(amount)
                            )
                        }
                    />
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color="black" onClick={() => onVisibilityChange(false)}>
                    go back
                </Button>

                {amount != 0 && notEnoughAllowance ? (
                    <Button.Group size="large">
                        <Button
                            loading={approveLoading}
                            onClick={() => onApprove(amount)}
                            className="signal-approve"
                        >
                            APPROVE
                        </Button>
                    </Button.Group>
                ) : (
                    <Button
                        content="Add Signal"
                        labelPosition="right"
                        icon="checkmark"
                        onClick={() => OnIncreaseSignal(project, amount)}
                        positive
                    />
                )}
            </Modal.Actions>
        </Modal>
    );
};
const RmoveSignalModal = ({
    open,
    onVisibilityChange,
    OnDecreaseSignal,
    project,
}: {
    open: boolean;
    onVisibilityChange: (i: boolean) => void;
    OnDecreaseSignal: (project: Project | null, amount: number) => void;
    project: Project | null;
}) => {
    const [amount, setAmount] = React.useState(0);

    return (
        <Modal
            onClose={() => onVisibilityChange(false)}
            onOpen={() => onVisibilityChange(true)}
            open={open}
        >
            <Modal.Header>Remove Signal</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Header>Select the amount</Header>
                    <Input
                        type="number"
                        className="signal-amount"
                        value={amount || ''}
                        placeholder={'Enter Amount'}
                        onChange={(e) =>
                            setAmount(
                                e.target.value == '' ||
                                    (re.test(e.target.value) &&
                                        Number(e.target.value) < 1e15)
                                    ? Number(e.target.value)
                                    : Number(amount)
                            )
                        }
                    />
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color="black" onClick={() => onVisibilityChange(false)}>
                    go back
                </Button>

                <Button
                    content="Add Signal"
                    labelPosition="right"
                    icon="checkmark"
                    onClick={() => OnDecreaseSignal(project, amount)}
                    positive
                />
            </Modal.Actions>
        </Modal>
    );
};
