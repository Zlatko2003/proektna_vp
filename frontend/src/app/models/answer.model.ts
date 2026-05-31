export interface Answer {
    _id: string;
    content: string;
    authorId: {
        _id: string;
        name: string;
        email: string;
    };
    questionId: string;
    isAccepted: boolean;
    votes: number;
    createdAt: Date;
}