import { css } from '@emotion/css';
import { FlexBox } from '../FlexBox/FlexBox';

export function Photo({ src, name }: { src: string; name?: string }) {
  return (
    <FlexBox className={styles.photoContainer}>
      <img className={styles.photoImg} src={src} alt={name ?? src} />
    </FlexBox>
  );
}

const styles = {
  photoContainer: css`
    flex: 1 1 auto;
    justify-content: center;
    align-items: center;
  `,
  photoImg: css`
    min-width: 100px;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    align-self: center;
    justify-self: center;
  `,
};
