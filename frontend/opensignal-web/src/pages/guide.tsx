import {Container, Grid} from 'semantic-ui-react';
import {useGetOpenSignalTokenContract} from '../hooks/Contract.hook';
import React from 'react';
import {GitcoinContext} from '../store';
const GuidePage = () => {
    const {state} = React.useContext(GitcoinContext);
    const [tokenContract] = useGetOpenSignalTokenContract();

    return (
        <Container>
            <div className="page-header">
                <h3>OpenSignal Guide</h3>
            </div>

            <Grid textAlign="center" verticalAlign="middle">
                <Grid.Column
                    style={{
                        maxWidth: 450,
                        marginTop: '2rem',
                    }}
                ></Grid.Column>
            </Grid>
        </Container>
    );
};

export {GuidePage};
