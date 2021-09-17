import { BigNumber } from "ethers";
import React, { useContext, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiExternalLink } from "react-icons/fi";
import { useHistory } from "react-router";
import { Button, Container, Form, Grid, Placeholder } from "semantic-ui-react";
import Web3 from "web3";
import { useGetOpenSignalContract, useGetOpenSignalTokenContract } from "../hooks/Contract.hook";
import { useGetMetadata } from "../hooks/Ipfs.hook";
import { useGetAllowance } from "../hooks/OpenSignalToken.hook";
import { saveOnIPFSwithNftStorage } from "../network/ipfs";
import { GitcoinContext } from "../store";
import { errorToastOpts, successToastOpts } from "../util/toast.util";

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
  const { state } = useContext(GitcoinContext);
  const imgRef = useRef(null);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [projectCreatedTx, setProjectCreatedTx] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [newProject, setNewProject] = useState<Project>(initialState);
  const [opensignalMeta] = useGetMetadata(state.openSignalContract);
  const [openSignalContract] = useGetOpenSignalContract(opensignalMeta);
  const [tokenMeta] = useGetMetadata(state.openSignalTokenContract);
  const [tokenContract] = useGetOpenSignalTokenContract(tokenMeta);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [allowance, allowanceLoading, allowanceErr] = useGetAllowance(
    state.wallets[0],
    tokenContract,
    opensignalMeta,
    approveLoading,
  );

  const history = useHistory();
  const goToProject = () => {
    history.push("/");
  };

  const onNewProject = async () => {
    if (!opensignalMeta || !tokenMeta) {
      toast("Contracts Not found", errorToastOpts);
      return;
    }
    if (newProject.selfStake < 2) {
      toast("Need atleast 2 tokens", errorToastOpts);
      return;
    }
    try {
      if (isNotApproved) {
        setApproveLoading(true);
        try {
          const approval = await tokenContract.methods.approve(
            opensignalMeta.properties.address,
            Web3.utils.toWei(newProject.selfStake.toString()),
          );
          const sentApproval = await approval.send({
            from: state.wallets[0],
          });
          console.log({ sentApproval, approval });
          setApproveLoading(false);
          toast("Approved ", successToastOpts());
          console.log({ approval });
        } catch (error) {
          toast(`Error`, errorToastOpts);
          setApproveLoading(false);
        }
        return;
      } else {
        setApproveLoading(false);
      }

      setCreateLoading(true);

      const metadata = await saveOnIPFSwithNftStorage({ ...newProject, avatar: "" }, avatar);

      console.log({ metadata });
      setNewProject({ ...newProject, link: metadata.url });
      if (!openSignalContract) {
        console.log("contract not found");
        toast("Contract not found", errorToastOpts);
        return;
      }

      const createProjectTx = await openSignalContract.methods
        .createProject(
          newProject.name,
          metadata.url,
          Web3.utils.toWei(newProject.selfStake.toString()),
        )
        .send({
          from: state.wallets[0],
        });
      setCreateLoading(false);
      setProjectCreatedTx(createProjectTx);
      toast(
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
          }}
        >
          Project created
          <FiExternalLink
            style={{
              marginLeft: "5px",
            }}
          />
        </div>,
        successToastOpts("🎉"),
      );
      await new Promise((r) => setTimeout(r, 4500));
      return goToProject();
    } catch (err) {
      toast("Error", errorToastOpts);
      setCreateLoading(false);
      setApproveLoading(false);
    }
  };

  const fileChange = (e: any) => {
    setAvatar(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      setNewProject({
        ...newProject,
        avatar: e.target.result,
      });
    };
    reader.readAsDataURL(e.target.files[0]);
    toast("File loaded", successToastOpts("📁✔️"));
  };
  const isNotApproved =
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
      {projectCreatedTx ? (
        // TODO: explorer link based on the current network
        <a href={`https://rinkeby.etherscan.io/tx/${projectCreatedTx}`}>
          <Toaster />
        </a>
      ) : (
        <Toaster />
      )}

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
                        (re.test(e.target.value) && Number(e.target.value) < 1e15)
                          ? Number(e.target.value)
                          : Number(newProject.selfStake),
                    })
                  }
                />
              </Form.Field>
              <Button
                onClick={onNewProject}
                className="btn"
                color={isNotApproved ? "pink" : "purple"}
                fluid
                size="large"
                disabled={projectCreatedTx !== null || newProject.selfStake == 0}
                loading={approveLoading || createLoading}
              >
                {isNotApproved ? "APPROVE TOKEN" : projectCreatedTx ? "✔️CREATED" : "CREATE"}
              </Button>
            </Container>
          </Form>
        </Grid.Column>
      </Grid>
    </Container>
  );
};
export { ProjectNewPage };
