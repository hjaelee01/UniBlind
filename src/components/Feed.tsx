import { useSelector } from "react-redux"
import { PostType } from "../types/PostType"
import { Post } from "./Post"
import { Grid, GridItem } from "@chakra-ui/react"
import { FeedType } from "../types/FeedType"
import React from "react"

export function Feed() {
    const feed = useSelector((state: FeedType) => state.feed)

    return (
        <div>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {feed.map((x) => (
                <GridItem key={x.postId}>
                  <Post
                    postId={x.postId}
                    title={x.title}
                    text={x.text.length > 100 ? x.text.substring(0, 100) + "..." : x.text}
                    voteCount={x.voteCount}
                  />
                </GridItem>
              ))}
            </Grid>
        </div>
    )
}