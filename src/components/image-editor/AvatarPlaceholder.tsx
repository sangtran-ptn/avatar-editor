import React from "react";
import { Avatar } from "@mui/material";
import { argbIntToCssColor } from "./imageUtils";

interface AvatarPlaceholderProps {
  text?: string;
}

const AvatarPlaceholder: React.FC<AvatarPlaceholderProps> = ({ text }) => {
  // ARGB from database: 4288074715 = dark teal background
  const backgroundColorArgb = 4288074715;
  const backgroundColor = argbIntToCssColor(backgroundColorArgb);

  // ARGB from database: 4294967295 = white
  const textColorArgb = 4294967295;
  const textColor = argbIntToCssColor(textColorArgb);

  const initial = text?.[0]?.toUpperCase() || "?";

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
      {initial}
    </Avatar>
  );
};

export default AvatarPlaceholder;
