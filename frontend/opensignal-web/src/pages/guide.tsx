import {Container, Grid} from 'semantic-ui-react';
import {useGetOpenSignalTokenContract} from '../hooks/Contract.hook';
import React from 'react';
import {GitcoinContext} from '../store';
const GuidePage = () => {
    const {state} = React.useContext(GitcoinContext);

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
                >
                    <p
                        style={{
                            fontSize: '1rem',
                            textShadow: '1px 2px 3px black',
                        }}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                    </p>
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export {GuidePage};
