import NextImage from 'next/image'
import type { ComponentProps } from 'react'

type ImageProps = ComponentProps<typeof NextImage> & {
  alt: string
}

export const Image = ({ alt, ...props }: ImageProps) => (
  <NextImage
    alt={alt}
    {...props}
  />
)
