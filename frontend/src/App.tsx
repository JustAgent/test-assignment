import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  AppBar,
  Box,
  createMuiTheme,
  CssBaseline,
  Grid,
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

  return (
    <>
      <CssBaseline />

      {account == "" ? (
        <Box
          sx={{
            background: `linear-gradient(22deg, rgba(140,253,255,1) 14%, rgba(127,165,255,0.6825323879551821) 48%, rgba(109,211,255,1) 100%)`,
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{ fontFamily: "Merriweather, serif", color: "#f7f7f7" }}
            >
              Welcome to our bet game
            </Typography>
          </Box>
          <Box mt={3} mb={3}>
            <Typography
              variant="h5"
              sx={{ fontFamily: "Merriweather, serif", color: "#f7f7f7" }}
            >
              Please connect your wallet
            </Typography>
          </Box>
          <Box>
            <Button
              size="large"
              variant="contained"
              sx={{
                backgroundColor: "#0671BE",
                height: "50px",
                borderRadius: "50px",
                "&:hover": {
                  backgroundColor: "#2B88CB",
                },
              }}
              onClick={handleMetamaskConnection}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: "Merriweather, serif",
                  color: "#f7f7f7",
                  fontWeight: "bold",
                }}
              >
                Connect Metamask
              </Typography>
            </Button>
          </Box>
        </Box>
      ) : loading ? (
        <Box></Box>
      ) : (
        <>
          <Toolbar
            sx={{
              position: "absolute",
              right: "10px",
              height: "10vh",
              display: "flex",
              flexDirection: "row",
              justifyContent: "right",
            }}
          >
            <Box margin="10px">
              <StyledAvatar />
            </Box>
            <Box>
              <Grid container>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    color: "#f7f7f7",
                    fontWeight: "bold",
                  }}
                >
                  {account.substring(0, 5)}...
                  {account.substring(account.length - 4)}
                </Typography>
              </Grid>
              <Typography
                sx={{
                  fontFamily: "Roboto, sans-serif",
                  color: "#f7f7f7",
                  fontWeight: "bold",
                }}
              >
                Your wallet balance: {totalBalance?.substring(0, 5)}
              </Typography>
            </Box>
          </Toolbar>
          <Box
            sx={{
              background: `linear-gradient(22deg, rgba(140,253,255,1) 14%, rgba(127,165,255,0.6825323879551821) 48%, rgba(109,211,255,1) 100%)`,
              height: "100vh",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ContractInteraction
              signer={provider?.getSigner()}
              account={account}
              balance={totalBalance}
              getBalance={getBalance}
            />
          </Box>
        </>
      )}
    </>
  );
}

export default App;
