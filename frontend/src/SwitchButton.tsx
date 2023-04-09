import { useState } from "react";
import { Button } from "@mui/material";

type SwitchButtonProps = {
  onSelect: (option: "deposit" | "withdraw") => void;
};

const SwitchButton = ({ onSelect }: SwitchButtonProps) => {
  const [activeOption, setActiveOption] = useState("deposit");

  const handleClick = (option: "deposit" | "withdraw") => {
    setActiveOption(option);
    onSelect(option);
  };

  return (
    <div>
      <Button
        variant={activeOption === "deposit" ? "contained" : "outlined"}
        onClick={() => handleClick("deposit")}
      >
        Deposit
      </Button>
      <Button
        variant={activeOption === "withdraw" ? "contained" : "outlined"}
        onClick={() => handleClick("withdraw")}
      >
        Withdraw
      </Button>
    </div>
  );
};

export default SwitchButton;
