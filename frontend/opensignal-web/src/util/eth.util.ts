const getNetworkName = (id?: string) => {
  const network = getNetworks().find((n) => n.chain == id);
  return network?.name || `UNDEFINED NETWORK ${id}`;
};

const getNetworks = () => {
  return [
    {
      name: "Mainnet",
      chain: "1",
    },
    {
      name: "Goerli",
      chain: "5",
    },
    {
      name: "Ropsten",
      chain: "3",
    },
    {
      name: "Rinkeby",
      chain: "4",
    },
    {
      name: "Kovan",
      chain: "42",
    },
    {
      name: "Binance Smart Chain",
      chain: "56",
    },
    {
      name: "Polygon",
      chain: "137",
    },
    {
      name: "Celo",
      chain: "42220",
    },
    {
      name: "Fantom Opera",
      chain: "250",
    },
  ];
};
const getNetworksOptions = () => {
  return getNetworks().map((n) => ({
    key: n.chain,
    value: n.chain,
    text: n.name,
  }));
};

const minimizeAddress = (addr: string, _k = 4): string => {
  const len = addr.length;
  return addr.substr(0, _k + 2) + "..." + addr.substr(len - _k, len);
};

const isAddress = (candidate: any) => {
  return (
    candidate &&
    candidate
      .toString()
      .trim()
      .match(/^0x[a-fA-F0-9]{40}$/)
  );
};

const getProviderName = () => {
  if (!window.web3) return "unknown";

  if (window.web3.currentProvider.isMetaMask) return "metamask";

  if (window.web3.currentProvider.isTrust) return "trust";

  if (window.web3.currentProvider.isGoWallet) return "goWallet";

  if (window.web3.currentProvider.isAlphaWallet) return "alphaWallet";

  if (window.web3.currentProvider.isStatus) return "status";

  if (window.web3.currentProvider.isToshi) return "coinbase";

  if (typeof window.__CIPHER__ !== "undefined") return "cipher";

  if (window.web3.currentProvider.constructor.name === "EthereumProvider") return "mist";

  if (window.web3.currentProvider.constructor.name === "Web3FrameProvider") return "parity";

  if (window.web3.currentProvider.host && window.web3.currentProvider.host.indexOf("infura") !== -1)
    return "infura";

  if (
    window.web3.currentProvider.host &&
    window.web3.currentProvider.host.indexOf("localhost") !== -1
  )
    return "localhost";

  return "unknown";
};

export { getNetworkName, getNetworks, getNetworksOptions, isAddress, minimizeAddress };
