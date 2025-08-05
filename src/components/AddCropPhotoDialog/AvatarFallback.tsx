import React from "react";
import { Avatar } from "@mui/material";
import { argbIntToCssColor } from "./utils";

interface AvatarFallbackProps {
  text?: string;
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ text }) => {
  const colorFromDB = "4288074715";
  const backgroundColor = argbIntToCssColor(parseInt(colorFromDB, 10));

  const textColorFromDB = "4294967295";
  const textColor = argbIntToCssColor(parseInt(textColorFromDB, 10));

  return (
    <Avatar
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: backgroundColor,
        color: textColor,
        fontSize: 220,
      }}
    >
      {text?.[0]?.toUpperCase() || "?"}
    </Avatar>
  );
};

export default AvatarFallback;
