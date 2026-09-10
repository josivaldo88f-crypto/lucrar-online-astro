export function cardImage(src: string): string {
	if (!src || !src.startsWith('/images/')) return src;
	return src.replace(/\.[^./]+$/, '-720.webp');
}
