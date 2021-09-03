import {
    Container,
    Form,
    Grid,
    Segment,
    Button,
    TextArea,
} from 'semantic-ui-react';
import {useHistory} from 'react-router';
import {useGetAllowance} from '../hooks/Token.hook';
import {GitcoinContext} from '../store';
import React from 'react';
import {
    useGetOpenSignalContract,
    useGetOpenSignalTokenContract,
} from '../hooks/Contract.hook';
import {NFTStorage, File, Blob} from 'nft.storage';
const ProjectNewPage = () => {
    const {state} = React.useContext(GitcoinContext);
    const [openSignalContract] = useGetOpenSignalContract(
        state.openSignalContract
    );
    const [tokenContract] = useGetOpenSignalTokenContract(
        state.openSignalTokenContract
    );
    const [allowance, allowanceLoading, allowanceErr] = useGetAllowance(
        state.wallets[0],
        tokenContract,
        openSignalContract.address
    );
    const history = useHistory();
    const goToProject = () => {
        history.push('/');
    };

    const onNewProject = async () => {
        openSignalContract.methods
            .createProject('Test', 'a', 2 * 1e18)
            .send({
                from: state.wallets[0],
            })
            .then(console.log)
            .catch(console.log);
    };

    const saveId = async (projectId: string) => {
        const apiKey =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFmRDg4MmY5YzlCZGE2QjMyOTVlZjIwZDFiM0VDNjA4NDJCREQxMTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDQ4NTQ2MDM0OSwibmFtZSI6Ik9wZW5TaWduYWwifQ.-Am4LeJJXbE6ONW6NfHdU2qIHGedHNuuIrfZPcpV0jU';
        const client = new NFTStorage({token: apiKey});

        const metadata = await client.store({
            name: 'OpenSignalToken',
            description: 'OpenSignalToken Contract Address',
            image: new Blob(),
            properties: {
                custom: [projectId],
            },
        });
        return metadata;
    };
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
                        <Container stacked>
                            <Form.Field>
                                <Form.Input
                                    icon="book"
                                    iconPosition="left"
                                    placeholder="Name"
                                />{' '}
                                <Form.Input
                                    fluid
                                    icon="linkify"
                                    iconPosition="left"
                                    placeholder="Link"
                                />
                                <Form.TextArea
                                    icon="lock"
                                    placeholder="Description"
                                />
                                <Form.Input
                                    fluid
                                    icon="dollar"
                                    iconPosition="left"
                                    placeholder="Initial Stake Amount"
                                />
                            </Form.Field>

                            <Button
                                onClick={() => onNewProject()}
                                className="btn"
                                color={
                                    !allowanceLoading && allowance > 0
                                        ? 'pink'
                                        : 'purple'
                                }
                                fluid
                                size="large"
                            >
                                {!allowanceLoading && allowance > 0
                                    ? 'APPROVE'
                                    : 'CREATE'}
                            </Button>
                        </Container>
                    </Form>
                </Grid.Column>
            </Grid>{' '}
        </Container>
    );
};
export {ProjectNewPage};
