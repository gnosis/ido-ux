interface Window {
  ethereum?: {
    isMetaMask?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    request?: (...args: any[]) => void
  };
  web3?: unknown;
}
