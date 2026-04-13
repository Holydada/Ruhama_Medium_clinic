import { useState } from 'react';
import clsx from 'clsx';
import {
  CLINIC_LOGO_FALLBACK,
  CLINIC_LOGO_PRIMARY,
  CLINIC_SHORT_NAME,
} from '../../lib/clinicBrand';

type Props = {
  className?: string;
  imgClassName?: string;
};

export function ClinicLogo({ className, imgClassName }: Props) {
  const [src, setSrc] = useState(CLINIC_LOGO_PRIMARY);

  return (
    <span className={clsx('inline-flex shrink-0 items-center justify-center', className)}>
      <img
        src={src}
        alt={CLINIC_SHORT_NAME}
        className={imgClassName}
        onError={() => {
          if (src !== CLINIC_LOGO_FALLBACK) setSrc(CLINIC_LOGO_FALLBACK);
        }}
      />
    </span>
  );
}
