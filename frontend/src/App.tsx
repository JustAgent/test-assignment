import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  AppBar,
  Box,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { Container, createTheme } from "@mui/system";
import ContractInteraction from "./ContractInteraction";
import { ethers, utils } from "ethers";
import StyledAvatar from "./Avatar";

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

    detectProvider().catch((error) => {
      console.log(error);
    });
  }, []);

  useEffect(() => {
    try {
      getCurrentAccount();
    } catch (error) {}
  }, [provider]);

  window.ethereum.on("accountsChanged", function (accounts: any) {
    getCurrentAccount();
  });

  const getCurrentAccount = async () => {
    if (provider) {
      const signer = provider.getSigner();
      const currentAccount = await signer.getAddress();
      setAccount(currentAccount);
      setLoading(false);

      getBalance();
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
  // const theme = createTheme({
  //   typography: {
  //     fontFamily: ["Rubik", "sans-serif"].join(","),
  //   },
  // });
  return (
    <>
      {/* <ThemeProvider theme={theme}> */}
      <CssBaseline />

      {account == "" ? (
        <Container
          sx={{
            background: `linear-gradient(to bottom right, #000000, #e0f0ed)`,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h2">Bet game</Typography>
          </Box>
          <Box mt={3} mb={3}>
            <Typography variant="h5">Please connect your wallet</Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleMetamaskConnection}
            >
              <Typography>Connect Metamask</Typography>
            </Button>
          </Box>
        </Container>
      ) : loading ? (
        <Box></Box>
      ) : (
        <>
          <AppBar position="static">
            <Container>
              <Box>
                {" "}
                <Toolbar>
                  <Typography>
                    <StyledAvatar />
                    {account.substring(0, 5)}...
                    {account.substring(account.length - 4)}
                  </Typography>
                </Toolbar>
                <Typography>
                  Your wallet balance: {totalBalance?.substring(0, 5)}
                </Typography>
              </Box>
            </Container>
          </AppBar>
          <ContractInteraction
            signer={provider?.getSigner()}
            account={account}
            balance={totalBalance}
            getBalance={getBalance}
          />
        </>
      )}
      {/* </ThemeProvider> */}
    </>
  );
}

export default App;
