import { Box, Button, Flex } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/layout";
import React from "react";
import Link from "next/link";

import ConnectButton from "../Buttons/ConnectButton";
import ThemeToggle from "./ThemeToggle";
import { WalletComponent } from "../Web3/Wallet.component";

const Header = () => {
  return (
    <Flex as="header" width="full" align="center">
      <Box marginLeft="auto">
        <Stack direction="row" spacing={6}>
          <Link href="/dapp/projects/" passHref>
            <Button w="sm">Projects</Button>
          </Link>
          <Link href="/dapp/projects/" passHref>
            <Button w="sm">Projects</Button>
          </Link>
          <Link href="/dapp/projects/" passHref>
            <Button w="sm">Projects</Button>
          </Link>
          <Link href="/dapp/projects/" passHref>
            <Button w="sm">Projects</Button>
          </Link>
          <ThemeToggle />
          {/* <ConnectButton /> */}
          <WalletComponent />
        </Stack>
      </Box>
    </Flex>
  );
};

export default Header;
