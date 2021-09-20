import { BigNumber, ethers } from "ethers";
import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiExternalLink } from "react-icons/fi";
import { useHistory } from "react-router";
import { Button, Container, Grid, Header, Icon, Input, Loader, Modal } from "semantic-ui-react";
import Web3 from "web3";
import OpenSignalTokenIcon from "../assets/icons/opensignal.png";
import { BouncyBalls } from "../components/util.component";
import { useGetOpenSignalContract, useGetOpenSignalTokenContract } from "../hooks/Contract.hook";
import { useGetMetadata } from "../hooks/Ipfs.hook";
import {
    useGetProjectIds,
    useGetProjects,
    useGetProjectURI,
    useGetreserveRatio,
    useGetSaleReturn,
} from "../hooks/OpenSignal.hook";

import {
    getShareContract,
    useGetShareAllowance,
    useGetShareBalance,
    useGetTotalSupply,
} from "../hooks/OpenSignalShares";

import { useGetAllowance } from "../hooks/OpenSignalToken.hook";
import { GitcoinContext } from "../store";
import { isAddress } from "../util/eth.util";
import { errorToastOpts, successToastOpts } from "../util/toast.util";
import { AddSignalModal } from "./add-signal.modal";
import { RmoveSignalModal } from "./remove-signal.modal";
const pat = /^((http|https):\/\/)/;

const ProjectPage = () => {
    const { state } = useContext(GitcoinContext);
    const [successfulTx, setSuccessfulTx] = useState<string | null>(null);
    const [trigger, settrigger] = useState<boolean>(false);
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const [selectedProjectMeta, setSelectedProjectMeta] = useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [addSignalModal, setAddSignalModal] = useState<boolean>(false);
    const [approveLoading, setApproveLoading] = useState<boolean>(false);
    const [approveProjectShareLoading, setApproveProjectShareLoading] = useState<boolean>(false);
    const [removeSignalModal, setRemoveSignalModal] = useState<boolean>(false);
    const history = useHistory();

    const [opensignalMeta] = useGetMetadata(state.openSignalContract);
    const [openSignalContract] = useGetOpenSignalContract(opensignalMeta);
    const [reserveRatio] = useGetreserveRatio(openSignalContract);
    const [tokenMeta] = useGetMetadata(state.openSignalTokenContract);
    const [tokenContract] = useGetOpenSignalTokenContract(tokenMeta);
    const [ids, _, err] = useGetProjectIds(openSignalContract, trigger);
    const [projects, projectsLoading, e] = useGetProjects(ids, openSignalContract);
    const [allowance, allowanceLoading, allowanceErr] = useGetAllowance(
        state.wallets[0],
        tokenContract,
        opensignalMeta,
        approveLoading,
    );

    const goToNewProject = () => {
        history.push("/projects/new");
    };

    const onApprove = (amount: number) => {
        setApproveLoading(true);
        tokenContract.methods
            .approve(opensignalMeta.properties.address, Web3.utils.toWei(amount.toString()))
            .send({
                from: state.wallets[0],
            })
            .then(() => {
                setApproveLoading(false);
                toast("Approved", successToastOpts());
            })
            .catch((err: any) => {
                setApproveLoading(false);
                toast("Error on approval", errorToastOpts);
                console.log(err);
            });
        return;
    };

    const onApproveProjectShare = (shareContractAddress: any, amount: number) => {
        setApproveProjectShareLoading(true);
        try {
            const shareContract = getShareContract(shareContractAddress);
            shareContract.methods
                .approve(opensignalMeta.properties.address, Web3.utils.toWei(amount.toString()))
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
                .addSignal(project.id, Web3.utils.toWei(amount.toString()))
                .send({
                    from: state.wallets[0],
                })
                .then((res: any) => {
                    setCreateLoading(false);
                    toast(
                        <div
                            style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                            }}
                        >
                            {`Signal increased of ${amount} successfully!`}
                            <FiExternalLink
                                style={{
                                    marginLeft: "5px",
                                }}
                            />
                        </div>,
                        successToastOpts("🎉"),
                    );
                    setSuccessfulTx(res.transactionHash);
                    setAddSignalModal(false);
                })
                .catch((err: any) => {
                    setCreateLoading(false);
                    toast(`Error increasing the signal!`, errorToastOpts);
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
                    toast(
                        <div
                            style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                            }}
                        >
                            {`Signal decreased of ${amount} successfully!`}
                            <FiExternalLink
                                style={{
                                    marginLeft: "5px",
                                }}
                            />
                        </div>,
                        successToastOpts(),
                    );
                    setSuccessfulTx(res.transactionHash);
                    setRemoveSignalModal(false);
                })
                .catch((err: any) => {
                    setCreateLoading(false);
                    toast(`Error decreasing the signal!`, errorToastOpts);
                    console.log(err);
                });
        }
    };

    return (
        <Container>
            {successfulTx ? (
                // TODO: create a generic component for this
                <a
                    href={`https://rinkeby.etherscan.io/tx/${successfulTx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Toaster />
                </a>
            ) : (
                <Toaster />
            )}
            <div className="page-header">
                <h3>Projects</h3>

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

            <Grid
                textAlign="center"
                verticalAlign="middle"
                style={{
                    marginTop: "2rem",
                }}
            >
                <div className="projects">
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
        </Container>
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
    opensignalMeta: any;
    tokenContract: any;
    onChange: () => void;
    setApproveLoading: (i: boolean) => void;
    setAddSignalModal: (i: boolean) => void;
    setRemoveSignalModal: (i: boolean) => void;
    onProjectChange: (p: Project, meta: Project) => void;
}) => {
    const { state } = useContext(GitcoinContext);

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
    // console.log('projectURI', projectURI);
    // console.log('projectMeta', projectMeta);
    // console.log('projectMetaLoading', shareBalance, shareBalanceLoading, err);
    return (
        <div className="project">
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
                                `${projectMeta?.properties?.name}`
                            )}
                        </h3>
                        {projectMeta?.properties?.link ? (
                            <a
                                style={{ padding: 8 }}
                                href={
                                    pat.test(projectMeta?.properties?.link)
                                        ? projectMeta?.properties?.link
                                        : "https://" + projectMeta?.properties?.link
                                }
                                target="_blank"
                            >
                                <Icon name="external alternate" />
                                website
                            </a>
                        ) : null}

                        {projectMeta?.properties?.twitter ? (
                            <a
                                style={{ padding: 8 }}
                                href={
                                    pat.test(projectMeta?.properties?.twitter)
                                        ? projectMeta?.properties?.twitter
                                        : "https://" + projectMeta?.properties?.twitter
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
                    >{`${projectMeta?.properties?.description}`}</p>
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
        </div>
    );
};
