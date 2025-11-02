import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import { DisplayItem, EntryType } from '../../types/proto/types';
import { FixedSizeList } from 'react-window';
import {
  EntityTitle,
  Icon,
  Card,
  Colors,
  CardList,
  CompoundTag,
  Classes,
  Tag,
  Checkbox,
} from '@blueprintjs/core';
import { Link, useNavigate } from 'react-router-dom';
import { getIconForType } from '../../utils/getIconForType';
import { FlexBox } from '../FlexBox/FlexBox';
import { useDebounce } from '@uidotdev/usehooks';
import { css } from '@emotion/css';
import { useDebouncedScrollOffset } from '../../utils/useDebouncedScrollOffset';
import { LIST_ROW_HEIGHT } from '../../constants/layout';
import { ChevronRight, Dot, Menu, More } from '@blueprintjs/icons';
import { match, P } from 'ts-pattern';

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: DisplayItem[];
}

const Row = memo(function RowComponent({ index, style, data }: RowProps) {
  const item = data[index];
  const icon = getIconForType(item.entryType);
  // const content = (
  //   <EntityTitle
  //     title={<span className={styles.listItemTitle}>{item.firstName}</span>}
  //     icon={<Icon icon={icon} className={styles.listItemIcon} />}
  //     ellipsize
  //     subtitle={
  //       <FlexBox gap={10} className={styles.listItemSubtitle}>
  //         {item.lastName !== '/' && (
  //           <>
  //             <code>{item.lastName}</code>
  //             {item.size ? (
  //               <FlexBox gap={4} style={{ alignItems: 'center' }}>
  //                 <Icon icon="box" size={12} />
  //                 <span>{item.size}</span>
  //               </FlexBox>
  //             ) : null}
  //           </>
  //         )}
  //         {item.modTime ? (
  //           <FlexBox gap={4} style={{ alignItems: 'center' }}>
  //             <Icon icon="time" size={12} />
  //             <span>{item.modTime}</span>
  //           </FlexBox>
  //         ) : null}
  //       </FlexBox>
  //     }
  //   />
  // );

  const navigate = useNavigate();
  const iconText = match(item)
    .with({ entryType: EntryType.ENTRY_TYPE_FOLDER }, () => '')
    .with({ firstName: '' }, () => '-')
    .otherwise(() => item.lastName.toUpperCase());

  // {item.entryType !== EntryType.ENTRY_TYPE_FOLDER && item.firstName
  //             ? item.lastName
  //             : ' - '}

  return (
    <div style={style}>
      <CardList>
        {/* <Link to={item.relativeUrl} className={styles.listItemLink}> */}
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
          {/* {item.modTime ? (
            <Tag className={Classes.TEXT_MUTED} minimal icon="time">
              <span>{item.modTime}</span>
            </Tag>
          ) : null} */}

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
  // listItemLink: css`
  //   /* background-color: pink; */
  //   &:hover {
  //     text-decoration: none;

  //     .list-item-title {
  //       text-decoration: underline;
  //     }
  //   }
  // `,
  listItemIcon: css`
    &&& {
      color: ${Colors.GRAY1};
    }
  `,
  listItemSubtitle: css``,
  listItemTitle: css``,
  listContainer: css``,
};
