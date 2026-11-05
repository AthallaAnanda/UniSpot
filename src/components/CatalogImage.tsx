import Image, { type ImageProps } from "next/image";

/** Resize bundled raster assets for their actual display size. Community URLs,
 * SVGs and icons keep their existing source without a remote image proxy. */
export default function CatalogImage({ src, ...props }: Omit<ImageProps, "src" | "loader" | "unoptimized"> & { src: string }) {
  const localRaster = src.startsWith("/assets/") && /\.(png|jpe?g|webp|avif)(?:\?|$)/i.test(src);
  return <Image {...props} src={src} unoptimized={!localRaster} decoding="async" />;
}
