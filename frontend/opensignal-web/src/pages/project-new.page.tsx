import {
    Container,
    Form,
    Grid,
    Segment,
    Button,
    TextArea,
    Placeholder,
} from 'semantic-ui-react';
import {useHistory} from 'react-router';
import {useGetAllowance} from '../hooks/Token.hook';
import {GitcoinContext} from '../store';
import React from 'react';
import {
    useGetOpenSignalContract,
    useGetOpenSignalTokenContract,
} from '../hooks/Contract.hook';

import Web3 from 'web3';
import {useGetMetadata} from '../hooks/Ipfs.hook';
import {BigNumber} from 'ethers';
import {saveOnIPFS} from '../network/ipfs';
const initialState: Project = {
    id: '',
    creator: '',
    deployment: '',
    name: '',
    description: '',
    link: '',
    twitter: '',
    avatar: '',
    selfStake: 0,
    signal: 0,
    project_id: '',
    tags: [],
};
const re = /^[0-9\b]+$/;
const ProjectNewPage = () => {
    const {state} = React.useContext(GitcoinContext);
    const imgRef = React.useRef(null);
    const [approveLoading, setApproveLoading] = React.useState<boolean>(false);
    const [createLoading, setCreateLoading] = React.useState<boolean>(false);
    const [newProject, setNewProject] = React.useState<Project>(initialState);
    const [opensignalMeta] = useGetMetadata(state.openSignalContract);
    const [openSignalContract] = useGetOpenSignalContract(opensignalMeta);
    const [tokenMeta] = useGetMetadata(state.openSignalTokenContract);
    const [tokenContract] = useGetOpenSignalTokenContract(tokenMeta);
    const [avatar, setavatar] = React.useState<File | null>(null);
    const [allowance, allowanceLoading, allowanceErr] = useGetAllowance(
        state.wallets[0],
        tokenContract,
        opensignalMeta,
        approveLoading
    );

    const history = useHistory();
    const goToProject = () => {
        history.push('/');
    };

    const onNewProject = async () => {
        if (!opensignalMeta || !tokenMeta) {
            return;
        }
        try {
            if (newProject.selfStake > 0) {
                if (notEnoughAllowance) {
                    setApproveLoading(true);
                    tokenContract.methods
                        .approve(
                            opensignalMeta.properties.address,
                            Web3.utils.toWei(newProject.selfStake.toString())
                        )
                        .send({
                            from: state.wallets[0],
                        })
                        .then((res: any) => {
                            console.log(res);
                        })
                        .catch((err: any) => {
                            setApproveLoading(false);
                            console.log(err);
                        });
                    return;
                }
            } else {
                setApproveLoading(false);
                return;
            }
            const metadata = await saveOnIPFS(
                {...newProject, avatar: ''},
                avatar
            );

            setNewProject({...newProject, link: metadata.url});
            if (!openSignalContract) {
                return console.log('contract not found');
            }

            setCreateLoading(true);
            openSignalContract.methods
                .createProject(
                    newProject.name,
                    metadata.url,
                    Web3.utils.toWei(newProject.selfStake.toString())
                )
                .send({
                    from: state.wallets[0],
                })
                .then((res: any) => {
                    setCreateLoading(false);
                    console.log(res);
                })
                .catch((err: any) => {
                    setCreateLoading(false);
                    console.log(err);
                });
        } catch (err) {
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
                BigNumber.from(newProject.selfStake).mul(
                    BigNumber.from(10).pow(18)
                )
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
                        marginTop: '4rem',
                        border: '2px solid white',
                        borderRadius: 8,
                    }}
                >
                    <Form>
                        <Container>
                            <Form.Field>
                                <div
                                    style={{
                                        width: '100%',
                                        marginBottom: 4,
                                    }}
                                >
                                    {newProject.avatar ? (
                                        <img
                                            style={{
                                                maxHeight: '20rem',
                                                objectFit: 'cover',
                                                width: '100%',
                                                border: '2px solid rgba(255,255,255,.5)',
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
                                    style={{width: '100%'}}
                                    content="Choose Photo"
                                    labelPosition="left"
                                    icon="file"
                                    onClick={() =>
                                        (imgRef?.current || ({} as any)).click()
                                    }
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
                                    value={newProject.tags.join(' ,')}
                                    onChange={(e) => {
                                        let value = e.target.value;

                                        if (
                                            value.substr(-2) === '  ' &&
                                            newProject.tags[
                                                newProject.tags.length - 1
                                            ].trim() != ''
                                        ) {
                                            value = value.trim() + ' ,';
                                        }
                                        if (value.includes('   ')) {
                                            value = value.substr(
                                                0,
                                                value.length - 1
                                            );
                                        }
                                        setNewProject({
                                            ...newProject,
                                            tags: value.split(' ,'),
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
                                                e.target.value == '' ||
                                                (re.test(e.target.value) &&
                                                    Number(e.target.value) <
                                                        1e15)
                                                    ? Number(e.target.value)
                                                    : Number(
                                                          newProject.selfStake
                                                      ),
                                        })
                                    }
                                />
                            </Form.Field>

                            <Button
                                onClick={() => onNewProject()}
                                className="btn"
                                color={notEnoughAllowance ? 'pink' : 'purple'}
                                fluid
                                size="large"
                                disabled={newProject.selfStake == 0}
                                loading={approveLoading || createLoading}
                            >
                                {notEnoughAllowance
                                    ? 'APPROVE TOKEN'
                                    : 'CREATE'}
                            </Button>
                        </Container>
                    </Form>
                </Grid.Column>
            </Grid>
        </Container>
    );
};
export {ProjectNewPage};
