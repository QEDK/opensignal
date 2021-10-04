import React from "react";
import { Container, Grid } from "semantic-ui-react";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { useGetOpenSignalContract, useGetOpenSignalTokenContract } from "../hooks/Contract.hook";
import { GitcoinContext } from "../store";
import { useGetMetadata } from "../hooks/Ipfs.hook";
import { useGetProjectIds, useGetProjects } from "../hooks/OpenSignal.hook";
import CardWithImage from "../components/card-with-image.component";
import { useHistory } from "react-router";

const StakingPage = () => {
    const { state } = React.useContext(GitcoinContext);
    const [trigger, settrigger] = React.useState<boolean>(false);
    const history = useHistory();
    // const [opensignalMeta] = useGetMetadata(state.openSignalContract);
    const [openSignalContract] = useGetOpenSignalContract(state.openSignalContractAddress);
    const [tokenMeta] = useGetMetadata(state.openSignalTokenContractAddress);
    const [tokenContract] = useGetOpenSignalTokenContract(tokenMeta);
    const [ids] = useGetProjectIds(openSignalContract, trigger);
    const [projects, projectsLoading, e] = useGetProjects(ids, openSignalContract);
    return (
        <Container>
            <Flex justifyContent="center">
                <Box p="2" mb="10">
                    <Heading size="2xl" color="purple.100">
                        Stake on your favorite projects
                    </Heading>
                </Box>
            </Flex>
            <Grid
                textAlign="center"
                verticalAlign="middle"
                style={{
                    marginTop: "2rem",
                }}
            >
                <div className="staking-projects">
                    {projects.map((p: any, i: any) => (
                        <CardWithImage project={p} key={i} />
                    ))}
                </div>
            </Grid>
        </Container>
    );
};

export { StakingPage };
