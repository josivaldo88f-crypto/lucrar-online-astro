import data from '../data/posts.generated.json';

export interface PostMeta {
	file: string;
	url: string;
	isIndex: boolean;
	title?: string;
	description?: string;
	categoria?: string;
	image?: string;
	date?: string;
	dateModified?: string;
	locale?: string;
}

export const allPosts: PostMeta[] = (data as { posts: PostMeta[] }).posts;

export function byNewest(a: PostMeta, b: PostMeta): number {
	return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
}
