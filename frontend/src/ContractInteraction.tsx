import {
  Button,
  CircularProgress,
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
  console.log("CI");
  const contractAddress = "0x75a90a5A2EEa1C6FE432e6753bc06B46De519F4b";
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
    // console.log(utils.formatEther(res));
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
  //   const testController = async () => {
  //     try {
  //       const tx = await contract.fulfillGame(
  //         "8704942807762824032702318667176181289014670804041371408796039437739611362351"
  //       );
  //       await tx.wait();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

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
    console.log(option);
    setButtonType(option);
  };
  return (
    <>
      <Box>
        <Typography>Your game balance: {gameBalance}</Typography>

        <form>
          <TextField
            label={`Value to ${
              buttonType === "deposit" ? "deposit" : "withdraw"
            }`}
            variant="outlined"
            value={value}
            onChange={handleValueChange}
          />
        </form>
        <Box>
          <SwitchButton onSelect={handleSwitch} />
        </Box>
        <Box>
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={
              buttonType === "deposit" ? depositController : withdrawController
            }
          >
            Confirm
          </Button>
        </Box>
        <Toolbar>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <></>
          )}

          <Button
            variant="contained"
            disabled={isLoading}
            onClick={playController}
          >
            Play
          </Button>

          {/* <Button
            variant="contained"
            disabled={isLoading}
            onClick={testController}
          >
            TEST
          </Button> */}
        </Toolbar>
      </Box>
    </>
  );
};

export default ContractInteraction;
