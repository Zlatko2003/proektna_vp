export interface Question {
    _id: string;
    title: string;
    content: string;
    authorId: {
        _id: string;
        name: string;
        email: string;
    };
    tags: string[];
    views: number;
    createdAt: Date;
    updatedAt: Date;
}