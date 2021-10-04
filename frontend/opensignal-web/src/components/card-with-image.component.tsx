import {
    Heading,
    Avatar,
    Box,
    Image,
    Flex,
    Text,
    Stack,
    Button,
    useColorModeValue,
    Popover,
    PopoverArrow,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
} from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import { BigNumber } from "ethers";
import { useContext, useEffect, useState } from "react";
import Web3 from "web3";

import {
    useGetOpenSignalContract,
    useGetRewardsDistributionContract,
} from "../hooks/Contract.hook";
import { useGetMetadata } from "../hooks/Ipfs.hook";
import { GitcoinContext } from "../store";
import { useGetProjectURI } from "../hooks/OpenSignal.hook";

export default function CardWithImage({ project }: { project: Project }) {
    const { state } = useContext(GitcoinContext);
    console.log(project);
    const [currentStakingAmount, setCurrentStakingAmount] = useState<number>(0);
    const [openSignalContract] = useGetOpenSignalContract(state.openSignalContract);
    const [rewardsDistibutionContract] = useGetRewardsDistributionContract(
        state.rewardDistributionContractAddress,
    );
    const [projectURI, projectURILoading, projectURIErr] = useGetProjectURI(
        project.id,
        openSignalContract,
    );
    const [projectMeta, projectMetaLoading] = useGetMetadata(projectURI);
    console.log({ projectMeta });
    const pId = Web3.utils.padLeft(Web3.utils.hexToBytes(project.id) as any, 32);
    const getCurrentStakingAmount = async () => {
        console.log(state.wallets[0]);
        console.log(rewardsDistibutionContract.methods);
        rewardsDistibutionContract.methods
            .getCurrentStakingAmount(state.wallets[0])
            .call()
            .then((amount: string) => {
                console.log(amount);
                setCurrentStakingAmount(parseInt(amount, 10));
            })
            .catch(console.log);
    };
    useEffect(() => {
        (async () => {
            await getCurrentStakingAmount();
        })();
    }, []);
    const OnIncreaseSignal = () => {
        const address = state.wallets[0];
        if (!address) {
            return toast("Please login before staking.");
        }
        console.log("ON SIGNAL INCREASE");
        openSignalContract.methods
            .addSignal(project.id, BigNumber.from(10).pow(18))
            .send({
                from: address,
            })
            .then(console.log)
            .catch(console.log);
    };
    const OnDecreaseSignal = () => {
        openSignalContract.methods
            .removeSignal(state.wallets[0], BigNumber.from(10).pow(18))
            .send({
                from: state.wallets[0],
            })
            .then(console.log)
            .catch(console.log);
    };
    return (
        projectMeta && (
            <Box
                maxW={"270px"}
                w={"full"}
                bg={useColorModeValue("white", "gray.800")}
                boxShadow={"2xl"}
                rounded={"3xl"}
                overflow={"hidden"}
                m="5"
            >
                <Image
                    h={"120px"}
                    w={"full"}
                    src={projectMeta?.avatar || project.avatar}
                    objectFit={"cover"}
                />
                <Flex justify={"center"} mt={-12}>
                    <Avatar
                        size={"xl"}
                        src={project.avatar}
                        alt={"Author"}
                        css={{
                            border: "2px solid white",
                        }}
                    />
                </Flex>

                <Box p={6}>
                    <Stack spacing={0} align={"center"} mb={5}>
                        <Heading fontSize={"2xl"} fontWeight={600} fontFamily={"body"}>
                            {projectMeta?.properties?.name || "No Name"}
                        </Heading>
                        <Text color={"gray.500"}>
                            {projectMeta?.properties?.description || "No Description"}
                        </Text>
                    </Stack>

                    <Stack direction={"row"} justify={"center"} spacing={6}>
                        <Stack spacing={0} align={"center"}>
                            <Popover>
                                <PopoverTrigger>
                                    <Button>
                                        {Web3.utils
                                            .fromWei(project.signal.toString())
                                            .substring(0, 6)}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>
                                        {Web3.utils.fromWei(project.signal.toString())}
                                    </PopoverHeader>
                                </PopoverContent>
                            </Popover>
                            <Text fontSize={"sm"} color={"gray.500"}>
                                Signaled
                            </Text>
                        </Stack>
                        <Stack spacing={0} align={"center"}>
                            <Popover>
                                <PopoverTrigger>
                                    <Button>
                                        {Web3.utils
                                            .fromWei(project.selfStake.toString())
                                            .substring(0, 6)}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>
                                        {Web3.utils.fromWei(project.selfStake.toString())}
                                    </PopoverHeader>
                                </PopoverContent>
                            </Popover>
                            <Text fontSize={"sm"} color={"gray.500"}>
                                Staked
                            </Text>
                        </Stack>
                    </Stack>

                    <Button
                        w={"full"}
                        mt={8}
                        background="#6F3FF5"
                        textColor="#ffcc00"
                        onClick={OnIncreaseSignal}
                        _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "lg",
                            fontWeight: "bold",
                            background: "#ffcc00",
                            color: "#6F3FF5",
                        }}
                        rounded="full"
                    >
                        Stake
                    </Button>
                    <Button
                        w={"full"}
                        mt={4}
                        background="#6F3FF5"
                        textColor="#ffcc00"
                        onClick={OnDecreaseSignal}
                        _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "lg",
                            fontWeight: "bold",
                            background: "#ffcc00",
                            color: "#6F3FF5",
                        }}
                        rounded="full"
                    >
                        Unstake
                    </Button>
                </Box>
            </Box>
        )
    );
}
