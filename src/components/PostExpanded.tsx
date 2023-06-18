import { Box, Container, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FeedType } from "../types/FeedType";
import React from "react";
import { auth } from "../firebase";

export function PostExpanded() {
  const { postId } = useParams<{ postId: string }>();

  const targetPost = useSelector((state: FeedType) =>
    state.feed.find(post => post.postId === postId)
  )

  // Render the page only if targetPost exists
  if (!targetPost) {
    return <div>This post doesn't exist.</div>;
  }
  return (
    <Grid
      templateAreas={`"header header"
                      "nav main"`}
      gridTemplateRows={'100px 1fr'}
      gridTemplateColumns={'25% 2fr'}
      h='100vh'
      color='blackAlpha.700'
      fontWeight='bold'
    >
      <GridItem pl='2' area={'header'}>
        <Header />
      </GridItem>
      <GridItem pl='2' bg="gray.100" area={'nav'} px={4} py={4}>
        <Navigation />
      </GridItem>
      <GridItem pl='2' bg="gray.100" area={'main'}>
        <Container padding='4' bg='white' border='2px solid' mt='24'>
          <Heading>{targetPost.title}</Heading>
          <Text>Posted by {targetPost.originalPoster}</Text>
          <p>{targetPost.text}</p>
        </Container>
      </GridItem>
    </Grid>
  );
}