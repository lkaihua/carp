import React from 'react';
import { FlexBox } from '../FlexBox/FlexBox';

type FlexColProps = React.ComponentProps<typeof FlexBox>;

export const FlexCol: React.FC<FlexColProps> = ({ style, ...rest }) => {
  return (
    <FlexBox
      style={{
        flexDirection: 'column',
        ...style,
      }}
      {...rest}
    />
  );
};
