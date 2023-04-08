import { Button, TextField, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ethers, utils } from "ethers";
import { string } from "prop-types";
import React, { useEffect, useState } from "react";
import ABI from "./abis/Game.json";
const ContractInteraction: React.FC<{
  signer?: ethers.providers.JsonRpcSigner;
  account?: string;
  balance?: string;
}> = ({ signer, account, balance }) => {
  const contractAddress = "0x75a90a5A2EEa1C6FE432e6753bc06B46De519F4b";
  const abi = ABI.abi;
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const [gameBalance, setGameBalance] = useState("");
  const [valueDeposit, setValueDeposit] = useState("");
  const [valueWithdraw, setValueWithdraw] = useState("");

  useEffect(() => {
    getGameBalance();
  }, [signer]);

  const handleDepositValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValueDeposit(event.target.value);
  };

  const handleWithdrawValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValueWithdraw(event.target.value);
  };

  const getGameBalance = async () => {
    const res = await contract.balanceOf(account);
    console.log(utils.formatEther(res));
    setGameBalance(utils.formatEther(res));
  };

  const depositController = async () => {
    try {
      const overrides = {
        value: ethers.utils.parseEther(valueDeposit),
      };
      const tx = await contract.deposit(overrides);
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  const playController = async () => {
    try {
      const tx = await contract.startGame();
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  const withdrawController = async () => {
    try {
      const tx = await contract.withdraw(
        ethers.utils.parseEther(valueWithdraw)
      );
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box width={500}>
        <Typography>Your game balance: {gameBalance}</Typography>
        <form>
          <TextField
            label="Value to deposit"
            variant="outlined"
            value={valueDeposit}
            onChange={handleDepositValueChange}
          />
        </form>
        <form>
          <TextField
            label="Value to withdraw"
            variant="outlined"
            value={valueWithdraw}
            onChange={handleWithdrawValueChange}
          />
        </form>
        <Toolbar>
          <Button variant="contained" onClick={depositController}>
            Deposit
          </Button>
          <Button variant="contained" onClick={playController}>
            Play
          </Button>
          <Button variant="contained" onClick={withdrawController}>
            Withdraw
          </Button>
        </Toolbar>
      </Box>
    </>
  );
};

export default ContractInteraction;
