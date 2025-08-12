import { forwardRef, memo, useRef } from 'react';
import { DisplayItem } from '../types/proto/types';
import { FixedSizeList } from 'react-window';
import { EntityTitle, Icon, Divider } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { getIconForType } from '../utils/getIconForType';
import { Box } from './Box';

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: DisplayItem[];
}

const Row = memo(({ index, style, data }: RowProps) => {
  const item = data[index];
  const icon = getIconForType(item.entryType);

  return (
    <div className="list-item" style={style}>
      <Link to={item.urlString} className="list-item-link">
        <EntityTitle
          title={<span className="list-item-title">{item.firstName}</span>}
          icon={icon}
          ellipsize
          subtitle={
            <Box gap={10} className="list-item-subtitle">
              {item.lastName !== '/' && (
                <>
                  <code>{item.lastName}</code>
                  <Box gap={4} style={{ alignItems: 'center' }}>
                    <Icon icon="box" size={12} />
                    <span>{item.size}</span>
                  </Box>
                </>
              )}
              <Box gap={4} style={{ alignItems: 'center' }}>
                <Icon icon="time" size={12} />
                <span>{item.modTime}</span>
              </Box>
            </Box>
          }
        />
      </Link>
      <Divider />
    </div>
  );
});

interface ListProps {
  width: number;
  height: number;
  itemData: DisplayItem[];
  rowHeight: number;
  setActiveRow: (rowIndex: number) => void;
}

export const List = forwardRef<FixedSizeList, ListProps>(
  ({ width, height, itemData, rowHeight, setActiveRow }: ListProps, ref) => {
    const hasMountedRef = useRef(false);
    return (
      <FixedSizeList
        ref={ref}
        className="list-container"
        width={width}
        height={height}
        itemData={itemData}
        itemCount={itemData.length}
        itemSize={rowHeight}
        onScroll={({ scrollOffset }) => {
          // First mounts
          if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
          }
          // Fix strange corner case when onScroll is triggered prematurely and overrides the value
          if (scrollOffset <= 10) {
            return;
          }
          setActiveRow(scrollOffset);
        }}
      >
        {Row}
      </FixedSizeList>
    );
  },
);
