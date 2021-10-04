import { Box, Button, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMoralis } from "react-moralis";

import WelcomeText from "../../components/static/WelcomeText";

function Dapp() {
  const { isAuthenticated, user, web3 } = useMoralis();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      setAddress(user.attributes.ethAddress);
    }
  }, [isAuthenticated, user]);

  return (
    <Box mb={8} w="full">
      <WelcomeText
        username={user ? user.get("username") : "Anon"}
        address={address}
      />
      {isAuthenticated && (
        <VStack>
          <Toaster />
          <Box>Hi!</Box>
        </VStack>
      )}
    </Box>
  );
}

export default Dapp;
