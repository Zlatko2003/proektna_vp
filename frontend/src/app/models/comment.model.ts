export interface Comment {
    _id: string;
    content: string;
    authorId: {
        _id: string;
        name: string;
        email: string;
    };
    parentType: 'question' | 'answer';
    parentId: string;
    createdAt: Date;
}