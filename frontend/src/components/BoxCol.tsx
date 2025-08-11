import React from "react";
import { Box } from "./Box";

interface BoxColProps extends React.ComponentProps<typeof Box> { }

export const BoxCol: React.FC<BoxColProps> = ({ style, ...rest }) => {
  return (
    <Box
      style={{
        flexDirection: "column",
        ...style,
      }}
      {...rest}
    />
  );
};
