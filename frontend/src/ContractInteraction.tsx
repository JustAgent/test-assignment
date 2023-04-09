import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ethers, utils } from "ethers";
import React, { useEffect, useState } from "react";
import ABI from "./abis/Game.json";
import SwitchButton from "./SwitchButton";

const ContractInteraction: React.FC<{
  signer?: ethers.providers.JsonRpcSigner;
  account?: string;
  balance?: string;
  getBalance: () => Promise<void>;
}> = ({ signer, account, balance, getBalance }) => {
  const contractAddress = "0xEcB437D03c89086c5274b73a2a990456b35Ff8D5";
  const abi = ABI.abi;
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const provider = new ethers.providers.JsonRpcProvider(
    import.meta.env.VITE_ALCHEMY
  );
  const [gameBalance, setGameBalance] = useState("");
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [buttonType, setButtonType] = useState("deposit");
  useEffect(() => {
    getGameBalance();
  }, [signer]);

  useEffect(() => {
    EventController(contract);
  }, []);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const getGameBalance = async () => {
    const res = await contract.balanceOf(account);
    setGameBalance(utils.formatEther(res));
  };

  const depositController = async () => {
    try {
      const overrides = {
        value: ethers.utils.parseEther(value),
      };
      const tx = await contract.deposit(overrides);
      setIsLoading(true);

      await tx.wait();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const playController = async () => {
    try {
      const tx = await contract.startGame();
      setIsLoading(true);
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };
  const withdrawController = async () => {
    try {
      const tx = await contract.withdraw(ethers.utils.parseEther(value));
      setIsLoading(true);

      await tx.wait();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const EventController = (contract: ethers.Contract) => {
    contract.on("Deposit", (from, amount) => {
      try {
        console.log(`${from} deposited ${utils.formatEther(amount)} ether`);
        getGameBalance();
        getBalance();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    });

    contract.on("Withdraw", (to, amount) => {
      try {
        console.log(`${to} withdrew ${utils.formatEther(amount)} ether`);
        getGameBalance();
        getBalance();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    });

    contract.on("GameStarted", (requestId, player) => {
      try {
        console.log(`Game with id ${requestId} started by ${player}`);
      } catch (error) {
        console.log(error);
      }
    });

    contract.on("RequestFulfilled", (requestId, word) => {
      try {
        const wordLast: string = word.toString();
        console.log("Value is: ", wordLast.charAt(wordLast.length - 1));
        const signer = new ethers.Wallet(import.meta.env.VITE_PK, provider);
        const contract = new ethers.Contract(contractAddress, abi, signer);
        contract.fulfillGame(requestId);
      } catch (error) {
        console.log(error);
      }
    });

    contract.on("GameFulfilled", (player, isWin) => {
      try {
        console.log(`Player ${player} ${isWin ? "won" : "lost"}`);
        getGameBalance();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    });
  };
  const handleSwitch = (option: string) => {
    setButtonType(option);
  };
  return (
    <>
      <Box>
        <Grid
          direction="column"
          justifyContent="center"
          alignItems="center"
          container
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Merriweather, serif",
                color: "#f7f7f7",
                fontWeight: "bold",
              }}
            >
              Your game balance: {gameBalance}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={`Value to ${
                buttonType === "deposit" ? "deposit" : "withdraw"
              }`}
              variant="outlined"
              value={value}
              onChange={handleValueChange}
              sx={{
                "& .MuiOutlinedInput-input": {
                  color: "#f7f7f7",
                  fontFamily: "Merriweather, serif",
                },
                "& .MuiOutlinedInput-root .MuiAutocomplete-input": {
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box>
              <SwitchButton onSelect={handleSwitch} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <Button
                  size="large"
                  variant="contained"
                  sx={{
                    backgroundColor: "#0671BE",
                    height: "50px",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "#2B88CB",
                    },
                  }}
                  disabled={isLoading}
                  onClick={
                    buttonType === "deposit"
                      ? depositController
                      : withdrawController
                  }
                >
                  Confirm
                </Button>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Toolbar>
              {isLoading ? (
                <></>
              ) : (
                <Button
                  size="large"
                  variant="contained"
                  sx={{
                    backgroundColor: "#0671BE",
                    height: "50px",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "#2B88CB",
                    },
                  }}
                  disabled={isLoading}
                  onClick={playController}
                >
                  Play
                </Button>
              )}
            </Toolbar>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ContractInteraction;
