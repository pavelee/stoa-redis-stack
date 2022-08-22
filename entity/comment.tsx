import { Entity, Schema } from 'redis-om';

export interface Comment {
    content: string;
    topic: string;
    author: string;
    created: Date;
    modified: Date;
}

export class Comment extends Entity { }

export const commentSchema = new Schema(Comment, {
    content: { type: 'string' },
    topic: { type: 'string' },
    author: { type: 'string' },
    created: { type: 'date' },
    modified: { type: 'date' },
})
