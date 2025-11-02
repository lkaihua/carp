import React from 'react';

interface FlexBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: number | string;
  margin?: number | string;
  gap?: number | string;
  flex?: string | number;
}

export const FlexBox: React.FC<FlexBoxProps> = ({
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
        display: 'flex',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
