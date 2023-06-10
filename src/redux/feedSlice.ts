import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from '../types/PostType';

type stateType = PostType[];

const initialState: stateType = []

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        // Here, state is PostType[], as defined in the type of initialState.
        postSubmit: (state, action: PayloadAction<PostType>) => {
            state.push(action.payload)
        },
        upvote: (state, action) => {
            const {postId} = action.payload;
            const existingPost = state.find(post => post.postId === postId)
            if (existingPost) {
                existingPost.voteCount += 1
            }
        },
        downvote: (state, action) => {
            const {postId} = action.payload;
            const existingPost = state.find(post => post.postId === postId)
            if (existingPost) {
                existingPost.voteCount -= 1
            }
        }
    }
})

export const { postSubmit, upvote, downvote } = feedSlice.actions;
export default feedSlice.reducer;