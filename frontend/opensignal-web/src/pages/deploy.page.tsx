import { Container, Form, Grid, Button } from "semantic-ui-react";
import { useGetOpenSignalTokenContract } from "../hooks/Contract.hook";
import React from "react";
import { GitcoinContext } from "../store";
import { NFTStorage, File } from "nft.storage";
import { deployContract } from "../contracts";
import { useGetMetadata } from "../hooks/Ipfs.hook";
const DeployPage = () => {
  const { state, dispatch } = React.useContext(GitcoinContext);
  const [tokenMeta] = useGetMetadata(state.openSignalTokenContract);
  const [opensignalMeta] = useGetMetadata(state.openSignalContract);

  const onDeployOpenSignal = async (name: string, args?: any[]) => {
    console.log("args", args);
    try {
      const address = await deployContract(state.chain_id, name, args || []);
      const meta = await SaveOnIfps(name, address);

      dispatch({
        type: `SET_${name.toUpperCase()}_URL`,
        payload: meta.url,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const SaveOnIfps = async (name: string, address: string) => {
    const apiKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFmRDg4MmY5YzlCZGE2QjMyOTVlZjIwZDFiM0VDNjA4NDJCREQxMTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDQ4NTQ2MDM0OSwibmFtZSI6Ik9wZW5TaWduYWwifQ.-Am4LeJJXbE6ONW6NfHdU2qIHGedHNuuIrfZPcpV0jU";
    const client = new NFTStorage({ token: apiKey });

    const metadata = await client.store({
      name: name,
      description: `${name} Contract Address`,
      image: new Blob(),
      properties: { address: address },
    });
    console.log("metadata", metadata);
    return metadata;
  };
  return (
    <Container>
      <div className="page-header">
        <h3>OpenSignal ReDeploy</h3>
      </div>

      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column
          style={{
            maxWidth: 450,
            marginTop: "2rem",
          }}
        >
          <Form>
            <Container>
              <Form.Field>
                <p className="page-header">OpenSignal</p>
                <Form.Input
                  icon="book"
                  iconPosition="left"
                  placeholder="OpenSignal"
                  value={state.openSignalContract}
                />
              </Form.Field>

              <Button
                onClick={() =>
                  onDeployOpenSignal("OpenSignal", [state.wallets[0], tokenMeta.properties.address])
                }
                className="btn"
                color="pink"
                fluid
                size="large"
              >
                DEPLOY
              </Button>
            </Container>
            <Container style={{ marginTop: "2rem" }}>
              <Form.Field>
                <p className="page-header">OpenSignalToken</p>
                <Form.Input
                  icon="book"
                  iconPosition="left"
                  placeholder="OpenSignalToken"
                  value={state.openSignalTokenContract}
                />
              </Form.Field>

              <Button
                onClick={() => onDeployOpenSignal("OpenSignalToken")}
                className="btn"
                color="pink"
                fluid
                size="large"
              >
                DEPLOY
              </Button>
            </Container>
          </Form>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export { DeployPage };
