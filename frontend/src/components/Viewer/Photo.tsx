import { Media } from '@blueprintjs/icons';

import { css } from '@emotion/css';

export function Photo({ src, name }: { src: string; name?: string }) {
  return (
    <div>
      <img className={styles.photoImg} src={src} alt={name ?? src} />
    </div>
  );
}

const styles = {
  photoImg: css`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    align-self: center;
    justify-self: center;
  `,
};
