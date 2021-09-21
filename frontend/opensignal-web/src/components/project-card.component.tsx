import { useContext } from "react";
import { Loader, Button, Icon } from "semantic-ui-react";
import Web3 from "web3";
import { useGetMetadata } from "../hooks/Ipfs.hook";
import { useGetProjectURI } from "../hooks/OpenSignal.hook";
import { useGetShareBalance } from "../hooks/OpenSignalShares";
import { GitcoinContext } from "../store";
import OpenSignalTokenIcon from "../assets/icons/opensignal.png";
const pat = /^((http|https):\/\/)/;
export const ProjectCard = ({
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
