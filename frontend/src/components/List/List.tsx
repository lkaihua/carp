import { forwardRef, memo } from 'react';
import { DisplayItem, EntryType } from '../../types/proto/types';
import { FixedSizeList } from 'react-window';
import {
  Icon,
  Card,
  Colors,
  CardList,
} from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';
import { getIconForType } from '../../utils/getIconForType';
import { FlexBox } from '../FlexBox/FlexBox';

import { css } from '@emotion/css';
import { useDebouncedScrollOffset } from '../../utils/useDebouncedScrollOffset';
import { LIST_ROW_HEIGHT } from '../../constants/layout';
import { ChevronRight } from '@blueprintjs/icons';


interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: DisplayItem[];
}

const Row = memo(function RowComponent({ index, style, data }: RowProps) {
  const item = data[index];
  const icon = getIconForType(item.entryType);

  const navigate = useNavigate();



  return (
    <div style={style}>
      <CardList>

        <Card
          className={styles.listItem}
          interactive={true}
          onClick={() => navigate(item.relativeUrl)}
        >
          <FlexBox style={{ gap: '5px' }}>
            <Icon icon={icon} className={styles.listItemIcon} />
            <span>{item.name}</span>
          </FlexBox>

          {/* 
          // todo: find a better way to display optional attributes like size, modTime
           */}

          {item.entryType == EntryType.ENTRY_TYPE_FOLDER ? (
            <ChevronRight />
          ) : null}
        </Card>
      </CardList>
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

export const List = forwardRef<FixedSizeList, ListProps>(function ListComponent(
  {
    width,
    height,
    itemData,
    rowHeight,
    onItemsRendered,
    setActiveVerticalPos,
  }: ListProps,
  ref,
) {

  console.log('List render with items:', itemData.length);

  const { handleScroll } = useDebouncedScrollOffset((offset) => {

    setActiveVerticalPos?.(offset);
  });

  return (
    <FixedSizeList
      ref={ref}
      className={styles.listContainer}
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
});

const styles = {
  listItem: css`
    &&& {
      min-height: ${LIST_ROW_HEIGHT}px;
    }
    justify-content: space-between;
    gap: 5px;
  `,

  listItemIcon: css`
    &&& {
      color: ${Colors.GRAY1};
    }
  `,
  listItemSubtitle: css``,
  listItemTitle: css``,
  listContainer: css``,
};
