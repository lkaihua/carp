import React from "react";

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: number | string;
  margin?: number | string;
  gap?: number | string;
  flex?: string | number;
}

export const Box: React.FC<BoxProps> = ({
  padding,
  margin,
  gap,
  flex,
  style,
  children,
  ...rest
}) => {
  return (
    <div
      style={{
        padding,
        margin,
        gap,
        flex,
        display: "flex",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
