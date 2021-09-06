import {Container, Grid} from 'semantic-ui-react';
import {BigNumber} from 'ethers';
import {useGetOpenSignalTokenContract} from '../hooks/Contract.hook';
import React from 'react';
import {GitcoinContext} from '../store';
import {useGetMetadata} from '../hooks/Ipfs.hook';

const TokenPage = () => {
    const {state} = React.useContext(GitcoinContext);
    const [tokenMeta] = useGetMetadata(state.openSignalTokenContract);
    const [tokenContract] = useGetOpenSignalTokenContract(tokenMeta);
    const onClaim = () => {
        if (tokenContract) {
            tokenContract.methods
                .fooClaim()
                .send({
                    from: state.wallets[0],
                })
                .then(console.log)
                .catch(console.log);
        }
    };

    return (
        <Container>
            <div className="page-header">
                <h3>OpenSignal Token</h3>
            </div>

            <Grid textAlign="center" verticalAlign="middle">
                <Grid.Column
                    style={{
                        maxWidth: 450,
                        marginTop: '2rem',
                    }}
                >
                    <div
                        style={{
                            fontSize: '3rem',
                            padding: '1rem 3rem',
                            border: '2px solid #1bd9ff',
                            boxShadow: '0 0 8px 5px #ff77a9',
                            textShadow: '4px 2px 0px  #1bd9ff',

                            color: '#ff77a9 ',
                        }}
                        className="btn"
                        onClick={onClaim}
                    >
                        CLAIM
                    </div>
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export {TokenPage};
