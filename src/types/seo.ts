export interface FaqItem {
    question: string;
    answer: string;
}

export interface SeoMetadata {
    title: string;
    headline?: string;
    description: string;
    image?: string;
    imageWidth?: number;
    imageHeight?: number;
    datePublished?: string;
    dateModified?: string;
    noindex?: boolean;
    faq?: FaqItem[];
}
