import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";
import { Container } from "@mui/system";
import ContractInteraction from "./ContractInteraction";
import dotenv from "dotenv";
import { ethers, utils } from "ethers";

function App() {
  const [account, setAccount] = useState<string>("");
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [totalBalance, setTotalBalance] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const chainId: number = 80001;

  useEffect(() => {
    const detectProvider = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
      }
    };
    detectProvider();
  }, []);

  useEffect(() => {
    getCurrentAccount();
  }, [provider]);

  window.ethereum.on("accountsChanged", function (accounts: any) {
    getCurrentAccount();
  });

  const getCurrentAccount = async () => {
    if (provider) {
      const signer = provider.getSigner();
      const currentAccount = await signer.getAddress();
      setAccount(currentAccount);
      getBalance();
      setLoading(false);
    }
  };

  const getBalance = async () => {
    if (provider) {
      const signer = provider.getSigner();

      const balance: string = utils.formatEther(await signer.getBalance());
      setTotalBalance(balance);
    }
  };

  const handleMetamaskConnection = async () => {
    console.log(account);
    if (!window.ethereum) {
      alert("Please install MetaMask");
    }
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      setProvider(provider);
      console.log("ASD");
      const accounts: string[] = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);

      if (provider.network.chainId != chainId) {
        try {
          await provider.send("wallet_switchEthereumChain", [
            { chainId: utils.hexValue(chainId) },
          ]);
        } catch (error: any) {
          if (error.code === 4902) {
            await provider.send("wallet_addEthereumChain", [
              {
                chainName: "Polygon Mumbai",
                chainId: utils.hexValue(chainId),
                nativeCurrency: {
                  name: "MATIC",
                  decimals: 18,
                  symbol: "MATIC",
                },
                rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
              },
            ]);
          }
        }
      }
      getBalance();
    } catch (error) {}
  };

  return (
    <>
      {loading ? (
        <Box></Box>
      ) : account == "" ? (
        <Button variant="contained" onClick={handleMetamaskConnection}>
          <Typography>Connect Metamask</Typography>
        </Button>
      ) : (
        <Container>
          <Box>
            {" "}
            <Typography>Your address: {account}</Typography>
            <Typography>Your wallet balance: {totalBalance}</Typography>
          </Box>
          <ContractInteraction
            signer={provider?.getSigner()}
            account={account}
            balance={totalBalance}
          />
        </Container>
      )}
    </>
  );
}

export default App;
