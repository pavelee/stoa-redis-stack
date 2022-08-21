import { Entity, Schema } from 'redis-om';

interface Comment {
    content: string;
    points: number;
    likes: string[];
    topic: string;
    author: string;
}

class Comment extends Entity { }

export const commentSchema = new Schema(Comment, {
    username: { type: 'string' },
    points: { type: 'number' },
    likes: { type: 'string[]' },
    topic: { type: 'string' },
    author: { type: 'string' },
})
