import { Container, Grid, Button, Icon, Input } from "semantic-ui-react";
import { Header, Loader, Modal } from "semantic-ui-react";
import { useHistory } from "react-router";
import { BigNumber, ethers } from "ethers";
import {
    useGetOpenSignalContract,
    useGetOpenSignalTokenContract,
    useGetRewardsDistributionContract,
    useGetOpenSignalProxyContract,
} from "../hooks/Contract.hook";
import { GitcoinContext } from "../store";
import React, { useState } from "react";
import {
    useGetProjectIds,
    useGetProjects,
    useGetProjectURI,
    useGetreserveRatio,
    useGetSaleReturn,
} from "../hooks/OpenSignal.hook";
import { useGetCurrentRewardEstimate } from "../hooks/rewardsDistribution.hook";
import { useGetMetadata } from "../hooks/Ipfs.hook";
import { BouncyBalls } from "../components/util.component";
import { isAddress } from "../util/eth.util";
import Web3 from "web3";
import { useGetAllowance } from "../hooks/OpenSignalToken.hook";
import {
    getShareContract,
    useGetShareAllowance,
    useGetShareBalance,
    useGetTotalSupply,
} from "../hooks/OpenSignalShares";
import OpenSignalTokenIcon from "../assets/icons/opensignal.png";
import { Flex, Box, Heading, SimpleGrid } from "@chakra-ui/layout";
const re = /^[0-9\b]+$/;
const pat = /^((http|https):\/\/)/;
const ProjectPage = () => {
    const { state } = React.useContext(GitcoinContext);
    const [trigger, settrigger] = React.useState<boolean>(false);
    const [createLoading, setCreateLoading] = React.useState<boolean>(false);
    const [selectedProjectMeta, setSelectedProjectMeta] = React.useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
    const [addSignalModal, setAddSignalModal] = React.useState<boolean>(false);
    const [approveLoading, setApproveLoading] = React.useState<boolean>(false);
    const [approveProjectShareLoading, setApproveProjectShareLoading] =
        React.useState<boolean>(false);
    const [removeSignalModal, setRemoveSignalModal] = React.useState<boolean>(false);
    const history = useHistory();

    // const [opensignalMeta] = useGetMetadata(state.openSignalContract);
    const [openSignalContract] = useGetOpenSignalContract(state.openSignalContractAddress);
    const [reserveRatio] = useGetreserveRatio(openSignalContract);
    const [tokenContract] = useGetOpenSignalTokenContract(state.openSignalTokenContractAddress);
    const [openSignalProxyContract] = useGetOpenSignalProxyContract(
        state.openSignalProxyContractAddress,
    );
    const [rewardsDistibutionContract] = useGetRewardsDistributionContract(
        state.rewardDistributionContractAddress,
    );
    const [ids, _, err] = useGetProjectIds(openSignalContract, trigger);
    const [projects, projectsLoading, e] = useGetProjects(ids, openSignalContract);
    const [allowance, allowanceLoading, allowanceErr] = useGetAllowance(
        state.wallets[0],
        tokenContract,
        state.openSignalContractAddress,
        approveLoading,
    );
    console.log(allowance);

    const goToNewProject = () => {
        history.push("/projects/new");
    };

    const onApprove = (amount: number) => {
        setApproveLoading(true);
        tokenContract.methods
            .approve(state.openSignalContractAddress, Web3.utils.toWei(amount.toString()))
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

    const onApproveProjectShare = (shareContractAddress: any, amount: number) => {
        setApproveProjectShareLoading(true);
        try {
            const shareContract = getShareContract(shareContractAddress);
            shareContract.methods
                .approve(state.openSignalContractAddress, Web3.utils.toWei(amount.toString()))
                .send({
                    from: state.wallets[0],
                })
                .then((res: any) => {
                    setApproveProjectShareLoading(false);
                })
                .catch((err: any) => {
                    setApproveProjectShareLoading(false);
                    console.log(err);
                });
        } catch (err) {
            setApproveProjectShareLoading(false);
            console.log(err);
        }
    };

    const OnIncreaseSignal = (project: Project | null, amount: number) => {
        if (project && openSignalContract && isAddress(openSignalContract._address) && amount > 0) {
            setCreateLoading(true);
            openSignalContract.methods
                .addSignal(
                    project.id,
                    Web3.utils.toWei(amount.toString()),
                    Web3.utils.toWei((0).toString()),
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

    const OnDecreaseSignal = (project: Project | null, amount: number, minAmount: number) => {
        if (project && openSignalContract && isAddress(openSignalContract._address) && amount > 0) {
            setCreateLoading(true);
            openSignalContract.methods
                .removeSignal(
                    project.id,
                    Web3.utils.toWei(amount.toString()),
                    Web3.utils.toWei((minAmount * 0.975).toString()),
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

    const getCurrentRewardEstimate = () => {
        console.log(rewardsDistibutionContract.methods);
        rewardsDistibutionContract.methods
            .getCurrentRewardEstimate(state.wallets[0])
            .call()
            // .getCurrentRewardEstimate(state.wallets[0])
            // .call()
            .then(console.log)
            .catch(console.log);
    };

    const getCurrentStakingAmount = () => {
        console.log(rewardsDistibutionContract.methods);
        rewardsDistibutionContract.methods
            .getCurrentStakingAmount()
            .call()
            // .getCurrentRewardEstimate(state.wallets[0])
            // .call()
            .then(console.log)
            .catch(console.log);
    };

    const changeEpochLength = (lengthInSeconds) => {
        console.log(lengthInSeconds);
        rewardsDistibutionContract.methods
            .changeEpochLength(lengthInSeconds)
            .send({ from: state.wallets[0] })
            .then(console.log)
            .catch(console.log);
    };

    const getUserIndex = () => {
        console.log(rewardsDistibutionContract.methods);
        rewardsDistibutionContract.methods
            .userIndex(state.wallets[0])
            .call()
            // .getCurrentRewardEstimate(state.wallets[0])
            // .call()
            .then(console.log)
            .catch(console.log);
    };

    const [epochLength, setEpochLength] = useState<any>(296000);

    return (
        <Box w="full">
            <div className="page-header">
                <Flex justifyContent="center">
                    <Box p="2" mb="10">
                        <Heading size="2xl" color="purple.100">
                            Projects
                        </Heading>
                    </Box>
                </Flex>
                <button onClick={getUserIndex}>GET USER INDEX ARRAY</button>
                <button onClick={getCurrentRewardEstimate}>GET CURRENT REWARD ESTIMATE</button>
                <button onClick={getCurrentStakingAmount}>GET CURRENT STAKING AMOUNT</button>
                <button onClick={() => changeEpochLength(epochLength)}>Change Epoch Length</button>
                <input
                    value={epochLength}
                    type="number"
                    onChange={(e) => {
                        setEpochLength(parseInt(e.target.value));
                    }}
                ></input>

                <button
                    style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        border: "1px solid #ddd",
                        color: "#ddd ",
                        backgroundColor: "transparent",
                        padding: " 0.5rem 1rem",
                        cursor: "pointer",
                    }}
                    onClick={goToNewProject}
                >
                    CREATE
                </button>
            </div>

            <SimpleGrid columns={3} spacing={10}>
                {projectsLoading ? <BouncyBalls style={{ marginTop: "20%" }} /> : null}
                {projects.map((p: any, i: any) => (
                    <ProjectCard
                        project={p}
                        key={i}
                        onProjectChange={(p, m) => {
                            setSelectedProject(p);
                            setSelectedProjectMeta(m);
                        }}
                        contract={openSignalContract}
                        tokenContract={tokenContract}
                        onChange={() => settrigger(!trigger)}
                        setApproveLoading={setApproveLoading}
                        setAddSignalModal={setAddSignalModal}
                        setRemoveSignalModal={setRemoveSignalModal}
                    />
                ))}
            </SimpleGrid>

            <AddSignalModal
                open={addSignalModal}
                createLoading={createLoading}
                onVisibilityChange={(i) => {
                    setAddSignalModal(i);
                    if (!i) {
                        setSelectedProjectMeta(null);
                        setSelectedProject(null);
                    }
                }}
                allowance={allowance}
                onApprove={onApprove}
                approveLoading={approveLoading}
                OnIncreaseSignal={OnIncreaseSignal}
                project={selectedProject}
                projectMeta={selectedProjectMeta}
            />
            <RmoveSignalModal
                reserveRatio={reserveRatio}
                open={removeSignalModal}
                createLoading={createLoading}
                onVisibilityChange={(i) => {
                    setRemoveSignalModal(i);
                    if (!i) {
                        setSelectedProjectMeta(null);
                        setSelectedProject(null);
                    }
                }}
                OnDecreaseSignal={OnDecreaseSignal}
                project={selectedProject}
                projectMeta={selectedProjectMeta}
                wallet={state.wallets[0]}
                contract={openSignalContract}
                approveLoading={approveProjectShareLoading}
                onApprove={onApproveProjectShare}
            />
        </Box>
    );
};

export { ProjectPage };

const ProjectCard = ({
    project,
    contract,
    setAddSignalModal,
    setRemoveSignalModal,
    onProjectChange,
}: {
    project: Project;
    contract: any;
    tokenContract: any;
    onChange: () => void;
    setApproveLoading: (i: boolean) => void;
    setAddSignalModal: (i: boolean) => void;
    setRemoveSignalModal: (i: boolean) => void;
    onProjectChange: (p: Project, meta: Project) => void;
}) => {
    const { state } = React.useContext(GitcoinContext);

    const [projectURI, projectURILoading, projectURIErr] = useGetProjectURI(project.id, contract);

    const [projectMeta, projectMetaLoading] = useGetMetadata(projectURI);
    const [shareBalance, shareBalanceLoading, shareBalanceErr] = useGetShareBalance(
        project?.deployment,
        state.wallets[0],
    );

    const onIncreaeSignal = () => {
        setAddSignalModal(true);
        onProjectChange(project, projectMeta);
    };

    const onDecreaseSignal = () => {
        setRemoveSignalModal(true);
        onProjectChange(project, projectMeta);
    };

    return projectMeta && projectMeta.properties ? (
        <Box>
            <div className="project-avatar">
                {projectMetaLoading ? (
                    <Loader active inverted size="big" />
                ) : (
                    <img
                        object-fit="cover"
                        src={projectMeta?.avatar ? projectMeta.avatar : project.avatar}
                    />
                )}
                <div className="project-avatar-sub">
                    <Button.Group size="large">
                        <Button onClick={() => onIncreaeSignal()}>
                            <Icon name="angle up" />
                        </Button>

                        <Button onClick={() => onDecreaseSignal()}>
                            <Icon name="angle down" />
                        </Button>
                    </Button.Group>
                </div>
            </div>
            <div className="project-info">
                <div className="project-header">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            height: "2.75rem",
                        }}
                    >
                        <h3 style={{ position: "relative" }}>
                            {projectMetaLoading ? (
                                <Loader active inverted size="small" />
                            ) : (
                                `${projectMeta?.properties.name}`
                            )}
                        </h3>
                        {projectMeta?.properties.link ? (
                            <a
                                style={{ padding: 8 }}
                                href={
                                    pat.test(projectMeta?.properties.link)
                                        ? projectMeta?.properties.link
                                        : "https://" + projectMeta?.properties.link
                                }
                                target="_blank"
                            >
                                <Icon name="external alternate" />
                                website
                            </a>
                        ) : null}

                        {projectMeta?.properties.twitter ? (
                            <a
                                style={{ padding: 8 }}
                                href={
                                    pat.test(projectMeta?.properties.twitter)
                                        ? projectMeta?.properties.twitter
                                        : "https://" + projectMeta?.properties.twitter
                                }
                                target="_blank"
                            >
                                <Icon name="twitter" />
                                twitter
                            </a>
                        ) : null}
                    </div>
                    <p style={{ margin: 0 }}>{`ID: ${project.id}`}</p>
                    <p style={{ margin: 0 }}>{`Deployment: ${project.deployment}`}</p>
                    <p style={{ margin: 0 }}>{`Creator: ${project.creator}`}</p>
                </div>
                <div style={{ padding: 8, flex: 1 }}>
                    <p
                        style={{
                            display: "inline-block",
                            paddingRight: 12,
                            margin: 0,
                        }}
                    >{`${projectMeta?.properties.description}`}</p>
                </div>
                <div className="project-signal">
                    <div className="signal">
                        <p> {`Your Stake: `}</p>
                        {shareBalanceLoading ? (
                            <div className="signal-info">
                                <Loader active inverted size="mini" />
                            </div>
                        ) : (
                            <div className="signal-info">
                                <p>{` ${shareBalance} `}</p>

                                <i className="my-icon">
                                    <img src={OpenSignalTokenIcon} alt="opensignal token" />
                                </i>
                            </div>
                        )}
                    </div>
                </div>
                <div className="project-signal">
                    <div className="signal">
                        <p> {`Signal: `}</p>

                        <p>{` ${Web3.utils.fromWei(project.signal.toString())} `}</p>

                        <i className="my-icon">
                            <img src={OpenSignalTokenIcon} alt="opensignal token" />
                        </i>
                    </div>
                    <div className="signal">
                        <p> {`Self Stake: `}</p>

                        <p>{` ${Web3.utils.fromWei(project.selfStake.toString())} `}</p>
                        <i className="my-icon">
                            <img src={OpenSignalTokenIcon} alt="opensignal token" />
                        </i>
                    </div>
                </div>
            </div>
        </Box>
    ) : (
        <p>loading</p>
    );
};

const AddSignalModal = ({
    open,
    createLoading,
    onVisibilityChange,
    OnIncreaseSignal,
    project,
    projectMeta,
    onApprove,
    allowance,
    approveLoading,
}: {
    open: boolean;
    createLoading: boolean;
    onVisibilityChange: (i: boolean) => void;
    OnIncreaseSignal: (project: Project | null, amount: number) => void;
    project: Project | null;
    projectMeta: Project | null;
    onApprove: (amount: number) => void;
    allowance: number;
    approveLoading: boolean;
}) => {
    const { state } = React.useContext(GitcoinContext);
    const [amount, setAmount] = React.useState(0);

    const notEnoughAllowance = BigNumber.from(allowance || 0).lt(
        BigNumber.from(amount).mul(BigNumber.from(10).pow(18)),
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
                    <Header>Enter amount</Header>
                    <Input
                        style={{ width: "100%" }}
                        type="number"
                        className="signal-amount"
                        value={amount || ""}
                        placeholder={"Enter Amount"}
                        onChange={(e) =>
                            setAmount(
                                e.target.value == "" ||
                                    (re.test(e.target.value) && Number(e.target.value) < 1e15)
                                    ? Number(e.target.value)
                                    : Number(amount),
                            )
                        }
                        label={
                            <button
                                className="limit-btn green"
                                onClick={() =>
                                    setAmount(state.tokenBalance < 0 ? amount : state.tokenBalance)
                                }
                            >
                                <p>MAX</p>
                                <div>
                                    {Number(state.tokenBalance) < 0 ? (
                                        <Loader size="mini" active />
                                    ) : (
                                        `${state.tokenBalance}`
                                    )}
                                </div>
                            </button>
                        }
                        labelPosition="right"
                    />
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color="grey" onClick={() => onVisibilityChange(false)}>
                    Back
                </Button>

                {amount != 0 && notEnoughAllowance ? (
                    <Button
                        color="violet"
                        labelPosition="right"
                        icon="checkmark"
                        content="APPROVE"
                        loading={approveLoading}
                        onClick={() => onApprove(amount)}
                        className="signal-approve"
                    />
                ) : (
                    <Button
                        content={"Increase Signal"}
                        loading={createLoading}
                        labelPosition="right"
                        icon="angle up"
                        onClick={() => OnIncreaseSignal(project, amount)}
                        positive
                    />
                )}
            </Modal.Actions>
        </Modal>
    );
};
const RmoveSignalModal = ({
    reserveRatio,
    open,
    onVisibilityChange,
    createLoading,
    approveLoading,
    onApprove,
    OnDecreaseSignal,
    project,
    projectMeta,
    wallet,
    contract,
}: {
    reserveRatio: string;
    open: boolean;
    onVisibilityChange: (i: boolean) => void;
    createLoading: boolean;
    approveLoading: boolean;
    onApprove: (address: string, i: number) => void;
    OnDecreaseSignal: (project: Project | null, amount: number, minAmount: number) => void;
    project: Project | null;
    projectMeta: Project | null;
    wallet: string;
    contract: any;
}) => {
    const [amount, setAmount] = React.useState(0);

    const [shareBalance, shareBalanceLoading, err] = useGetShareBalance(
        project?.deployment,
        wallet,
        createLoading,
    );

    const [shareAllowance, shareAllowanceLoading] = useGetShareAllowance(
        contract?._address,
        project?.deployment,
        wallet,
        approveLoading,
    );

    const [totalSupply, totalSupplyLoading, totalSupplyErr] = useGetTotalSupply(
        project?.deployment,
    );

    const [saleReturn, saleReturnLoading] = useGetSaleReturn(
        "TODO",
        project?.signal.toString() || "",
        totalSupply,
        reserveRatio,
        amount.toString(),
    );

    const notEnoughAllowance = BigNumber.from(shareAllowance || "0").lt(
        ethers.utils.parseEther((amount || "0").toString()),
    );

    return (
        <Modal
            onClose={() => onVisibilityChange(false)}
            onOpen={() => onVisibilityChange(true)}
            open={open}
        >
            <Modal.Header>Decrease Signal</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Header>{`${projectMeta?.name}`}</Header>
                    <Header>
                        {shareBalanceLoading ? (
                            <Loader size="mini" active />
                        ) : (
                            `Your stake: ${shareBalance}`
                        )}
                    </Header>

                    <Input
                        style={{ width: "100%" }}
                        className="signal-amount"
                        value={amount || ""}
                        placeholder={"Enter Amount"}
                        onChange={(e) =>
                            setAmount(
                                e.target.value == "" ||
                                    (re.test(e.target.value) && Number(e.target.value) < 1e15)
                                    ? Number(e.target.value)
                                    : Number(amount),
                            )
                        }
                        label={
                            <button
                                className="limit-btn red"
                                onClick={() => {
                                    console.log("shareBalance", shareBalanceLoading, shareBalance);
                                    setAmount(shareBalanceLoading ? amount : shareBalance);
                                }}
                            >
                                <p>MAX</p>
                                <div>
                                    {shareBalanceLoading ? (
                                        <Loader size="mini" active />
                                    ) : (
                                        `${shareBalance}`
                                    )}
                                </div>
                            </button>
                        }
                        labelPosition="right"
                    />
                    {!saleReturnLoading && Number(saleReturn) > 0 && Number(amount) > 0 ? (
                        <Header>{`Sale Return: ${saleReturn}`}</Header>
                    ) : null}
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color="grey" onClick={() => onVisibilityChange(false)}>
                    Back
                </Button>

                {amount != 0 && notEnoughAllowance ? (
                    <Button
                        color="violet"
                        labelPosition="right"
                        icon="checkmark"
                        loading={approveLoading || shareAllowanceLoading}
                        content="APPROVE"
                        onClick={() => onApprove(project?.deployment || "", amount)}
                        className="signal-approve"
                    />
                ) : (
                    <Button
                        content={"Decrease Signal"}
                        loading={createLoading || totalSupplyLoading || saleReturnLoading}
                        labelPosition="right"
                        icon="angle down"
                        onClick={() => OnDecreaseSignal(project, amount, saleReturn)}
                        negative
                    />
                )}
            </Modal.Actions>
        </Modal>
    );
};
