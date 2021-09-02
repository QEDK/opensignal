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
const ProjectNewPage = () => {
    const {state} = React.useContext(GitcoinContext);
    const [opensignalContract] = useGetOpenSignalContract();
    const [tokenContract] = useGetOpenSignalTokenContract();
    const [allowance, allowanceLoading, allowanceErr] = useGetAllowance(
        state.wallets[0],
        tokenContract,
        opensignalContract.address
    );
    const history = useHistory();
    const goToProject = () => {
        history.push('/');
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
