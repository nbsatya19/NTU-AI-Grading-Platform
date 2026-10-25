// Prefixes local image paths with the basePath so they resolve on GitHub Pages.
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("/")) return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${src}`
  return src
}
