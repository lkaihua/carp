import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import { DisplayItem } from '../../types/proto/types';
import { FixedSizeList } from 'react-window';
import { EntityTitle, Icon, Divider } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { getIconForType } from '../../utils/getIconForType';
import { Box } from '../Box/Box';
import { useDebounce } from '@uidotdev/usehooks';

import './List.css';
import { useDebouncedScrollOffset } from '../../utils/useDebouncedScrollOffset';

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: DisplayItem[];
}

const Row = memo(({ index, style, data }: RowProps) => {
  const item = data[index];
  const icon = getIconForType(item.entryType);

  const content = (
    <EntityTitle
      title={<span className="list-item-title">{item.firstName}</span>}
      icon={icon}
      ellipsize
      subtitle={
        <Box gap={10} className="list-item-subtitle">
          {item.lastName !== '/' && (
            <>
              <code>{item.lastName}</code>
              {item.size ? (
                <Box gap={4} style={{ alignItems: 'center' }}>
                  <Icon icon="box" size={12} />
                  <span>{item.size}</span>
                </Box>
              ) : null}
            </>
          )}
          {item.modTime ? (
            <Box gap={4} style={{ alignItems: 'center' }}>
              <Icon icon="time" size={12} />
              <span>{item.modTime}</span>
            </Box>
          ) : null}
        </Box>
      }
    />
  );
  return (
    <div className="list-item" style={style}>
      <div className="list-item-link-container">
        {item.urlString ? (
          <Link to={item.urlString} className="list-item-link">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
      <Divider />
    </div>
  );
});

interface ListProps {
  width: number;
  height: number;
  itemData: DisplayItem[];
  rowHeight: number;
  onItemsRendered?: () => void;
  setActiveVerticalPos?: (rowIndex: number) => void;
}

export const List = forwardRef<FixedSizeList, ListProps>(
  (
    {
      width,
      height,
      itemData,
      rowHeight,
      onItemsRendered,
      setActiveVerticalPos,
    }: ListProps,
    ref,
  ) => {
    // const hasMountedRef = useRef(false);
    // const [scrollOffset, setScrollOffset] = useState(0);
    // const debouncedScrollOffset = useDebounce(scrollOffset, 150);

    // useEffect(() => {
    //   if (!hasMountedRef.current) return;

    //   if (debouncedScrollOffset >= 0) {
    //     console.log('scroll finished at:', debouncedScrollOffset);
    //     setActiveVerticalPos(debouncedScrollOffset);
    //   }
    // }, [debouncedScrollOffset]);

    console.log('List render with items:', itemData.length);

    const { handleScroll } = useDebouncedScrollOffset((offset) => {
      // console.log('List scroll finished at:', offset);
      setActiveVerticalPos?.(offset);
    });

    return (
      <FixedSizeList
        ref={ref}
        className="list-container"
        width={width}
        height={height}
        itemData={itemData}
        itemCount={itemData.length}
        itemSize={rowHeight}
        onItemsRendered={() => onItemsRendered?.()}
        onScroll={({ scrollOffset }) => handleScroll(scrollOffset)}
      >
        {Row}
      </FixedSizeList>
    );
  },
);
