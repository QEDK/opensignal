import { Container, Form, Grid, Segment, Button, TextArea, Placeholder } from "semantic-ui-react";
import { useHistory } from "react-router";
import { useGetAllowance } from "../hooks/OpenSignalToken.hook";
import { GitcoinContext } from "../store";
import React, { useEffect } from "react";
import {
    useGetOpenSignalContract,
    useGetOpenSignalProxyContract,
    useGetOpenSignalTokenContract,
    useGetRewardsDistributionContract,
} from "../hooks/Contract.hook";

import Web3 from "web3";
import { useGetMetadata } from "../hooks/Ipfs.hook";
import { BigNumber } from "ethers";
import { saveOnIPFS, saveOnIPFSWithWeb3Storage } from "../network/ipfs";
const initialState: Project = {
    id: "",
    creator: "",
    deployment: "",
    name: "",
    description: "",
    link: "",
    twitter: "",
    avatar: "",
    selfStake: 0,
    signal: 0,
    project_id: "",
    tags: [],
};
const re = /^[0-9\b]+$/;
const ProjectNewPage = () => {
    const { state } = React.useContext(GitcoinContext);
    const imgRef = React.useRef(null);
    const [approveLoading, setApproveLoading] = React.useState<boolean>(false);
    const [error, seterror] = React.useState<string>("");
    const [createLoading, setCreateLoading] = React.useState<boolean>(false);
    const [newProject, setNewProject] = React.useState<Project>(initialState);
    // const [opensignalMeta] = useGetMetadata(state.openSignalContract);
    const [openSignalContract] = useGetOpenSignalContract(state.openSignalContractAddress);
    // const [tokenMeta] = useGetMetadata(state.openSignalTokenContract);
    const [tokenContract] = useGetOpenSignalTokenContract(state.openSignalTokenContractAddress);
    const [rewardsContract] = useGetRewardsDistributionContract(
        state.rewardDistributionContractAddress,
    );
    const [avatar, setavatar] = React.useState<File | null>(null);
    const [allowance, allowanceLoading, allowanceErr] = useGetAllowance(
        state.wallets[0],
        tokenContract,
        state.openSignalContractAddress,
        approveLoading,
    );
    console.log(allowance, "allow");

    const history = useHistory();
    const goToProject = () => {
        history.push("/");
    };

    useEffect(() => {
        console.log(state.wallets[0], state.openSignalContractAddress, "ssss");
        tokenContract &&
            state.wallets[0] &&
            tokenContract.methods &&
            tokenContract.methods
                .allowance(state.wallets[0], state.openSignalContractAddress)
                .call()
                .then((res) => console.log(res, "result"));
    }, [tokenContract, state.wallets]);

    const onNewProject = async () => {
        // if (!tokenMeta) {
        //     seterror('Contracts Not found');
        //     return;
        // }
        if (newProject.selfStake < 2) {
            seterror("Need atleast 2 tokens");
            return;
        }
        try {
            seterror("");
            if (notEnoughAllowance) {
                setApproveLoading(true);
                tokenContract.methods
                    .approve(
                        state.openSignalContractAddress,
                        Web3.utils.toWei(newProject.selfStake.toString()),
                    )
                    .send({
                        from: state.wallets[0],
                    })
                    .then((res: any) => {
                        setCreateLoading(false);
                        setApproveLoading(false);
                        console.log(res);
                    })
                    .catch((err: any) => {
                        console.log(err, "err");
                        seterror("Error");
                        setApproveLoading(false);
                        console.log(err);
                    });
                return;
            } else {
                setApproveLoading(false);
            }

            const { imageURL, metadataURL } = await saveOnIPFSWithWeb3Storage(
                { ...newProject, avatar: "" },
                avatar,
            );

            setNewProject({ ...newProject, link: metadataURL });
            if (!openSignalContract) {
                return console.log("contract not found");
            }

            setCreateLoading(true);
            console.log(newProject.selfStake.toString(), "selfStake");
            console.log(openSignalContract._address, "address of openSignalContract");
            // tokenContract.methods
            //     .allowance(state.wallets[0], state.openSignalTokenContractAddress)
            //     .call()
            //     .then((rez) => console.log(rez, "resultallowance"));
            // await tokenContract.methods
            //     .approve(
            //         state.openSignalContractAddress,
            //         Web3.utils.toWei(newProject.selfStake.toString()),
            //     )
            //     .send({
            //         from: state.wallets[0],
            //     });
            openSignalContract.methods
                .createProject(
                    newProject.name,
                    metadataURL,
                    Web3.utils.toWei(newProject.selfStake.toString()),
                )
                .send({
                    from: state.wallets[0],
                })
                .then((res: any) => {
                    setCreateLoading(false);
                    console.log(res);
                })
                .catch((err: any) => {
                    seterror("Error");
                    setCreateLoading(false);
                    console.log(err);
                });
        } catch (err) {
            console.log(err);
            seterror("Error");
            setCreateLoading(false);
            setApproveLoading(false);
        }
    };

    const fileChange = (e: any) => {
        setavatar(e.target.files[0]);
        const reader = new FileReader();
        reader.onload = (e: any) => {
            setNewProject({
                ...newProject,
                avatar: e.target.result,
            });
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const notEnoughAllowance =
        newProject.selfStake == 0 ||
        (!allowanceLoading &&
            BigNumber.from(allowance).lt(
                BigNumber.from(newProject.selfStake).mul(BigNumber.from(10).pow(18)),
            ));
    return (
        <Container>
            <div className="page-header">
                <h3>NEW PROJECT</h3>
            </div>
            <Grid textAlign="center" verticalAlign="middle">
                <Grid.Column
                    style={{
                        maxWidth: 450,
                        marginTop: "4rem",
                        border: "2px solid white",
                        borderRadius: 8,
                    }}
                >
                    <Form>
                        <Container>
                            <Form.Field>
                                <div
                                    style={{
                                        width: "100%",
                                        marginBottom: 4,
                                    }}
                                >
                                    {newProject.avatar ? (
                                        <img
                                            style={{
                                                maxHeight: "20rem",
                                                objectFit: "cover",
                                                width: "100%",
                                                border: "2px solid rgba(255,255,255,.5)",
                                            }}
                                            src={newProject.avatar}
                                            alt="project avatar"
                                        />
                                    ) : (
                                        <Placeholder>
                                            <Placeholder.Image square />
                                        </Placeholder>
                                    )}
                                </div>
                                <Button
                                    style={{ width: "100%" }}
                                    content="Choose Photo"
                                    labelPosition="left"
                                    icon="file"
                                    onClick={() => (imgRef?.current || ({} as any)).click()}
                                />
                                <input
                                    accept="image/png, image/jpeg"
                                    ref={imgRef}
                                    type="file"
                                    hidden
                                    onChange={fileChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input
                                    icon="book"
                                    iconPosition="left"
                                    placeholder="Name"
                                    value={newProject.name}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <Form.Input
                                    fluid
                                    icon="linkify"
                                    iconPosition="left"
                                    placeholder="Link"
                                    value={newProject.link}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            link: e.target.value,
                                        })
                                    }
                                />
                                <Form.Input
                                    fluid
                                    icon="twitter"
                                    iconPosition="left"
                                    placeholder="Twitter"
                                    value={newProject.twitter}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            twitter: e.target.value,
                                        })
                                    }
                                />
                                <Form.Input
                                    fluid
                                    icon="tag"
                                    iconPosition="left"
                                    placeholder="Tags"
                                    value={newProject.tags.join(" ,")}
                                    onChange={(e) => {
                                        let value = e.target.value;

                                        if (
                                            value.substr(-2) === "  " &&
                                            newProject.tags[newProject.tags.length - 1].trim() != ""
                                        ) {
                                            value = value.trim() + " ,";
                                        }
                                        if (value.includes("   ")) {
                                            value = value.substr(0, value.length - 1);
                                        }
                                        setNewProject({
                                            ...newProject,
                                            tags: value.split(" ,"),
                                        });
                                    }}
                                />
                                <Form.TextArea
                                    icon="lock"
                                    placeholder="Description"
                                    value={newProject.description}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            description: e.target.value,
                                        })
                                    }
                                />
                                <Form.Input
                                    fluid
                                    icon="ethereum"
                                    iconPosition="left"
                                    placeholder="Initial Stake Amount"
                                    value={+Number(newProject.selfStake)}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            selfStake:
                                                e.target.value == "" ||
                                                (re.test(e.target.value) &&
                                                    Number(e.target.value) < 1e15)
                                                    ? Number(e.target.value)
                                                    : Number(newProject.selfStake),
                                        })
                                    }
                                />
                            </Form.Field>
                            {error ? (
                                <p
                                    style={{
                                        padding: 8,
                                        color: "crimson",
                                        width: "100%",
                                    }}
                                >
                                    {error}
                                </p>
                            ) : null}
                            <Button
                                onClick={() => onNewProject()}
                                className="btn"
                                color={notEnoughAllowance ? "pink" : "purple"}
                                fluid
                                size="large"
                                disabled={newProject.selfStake == 0}
                                loading={approveLoading || createLoading}
                            >
                                {notEnoughAllowance ? "APPROVE TOKEN" : "CREATE"}
                            </Button>
                        </Container>
                    </Form>
                </Grid.Column>
            </Grid>
        </Container>
    );
};
export { ProjectNewPage };
