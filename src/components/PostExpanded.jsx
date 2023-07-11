import { Box, Button, Container, Flex, Grid, GridItem, Heading, IconButton, Text, Textarea } from "@chakra-ui/react";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FeedType } from "../types/FeedType";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { BiBookmark, BiChat, BiShare } from "react-icons/bi";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

export function PostExpanded() {
  // TODO: Fetch all comments for this post from Firebase
  const postId = useParams().postId;
  const [comment, setComment] = React.useState("");
  const poster = auth.currentUser.displayName;
  const [targetPost, setTargetPost] = useState(null);
  const docRef = doc(db, "posts", postId);
  const colRef = collection(docRef, "comments")

  const handleCommentClick = async() => {
    const commentData = {
      comment: comment,
      poster: poster
    }
    // TODO: Dispatch action to add comment to Redux

    // TODO: Add comment to Firebase
    await addDoc(colRef, commentData)
  }

  useEffect(() => {
    const fetchPostData = async () => {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTargetPost(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchPostData();
  }, [postId]);

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
          <Flex justify='space-between' mt='4'>
            <IconButton
              variant='ghost'
              colorScheme='gray'
              aria-label='Reply'
              icon={<BiChat />}
            />
            <IconButton
              variant='ghost'
              colorScheme='gray'
              aria-label='Save'
              icon={<BiBookmark />}
            />
            <IconButton
              variant='ghost'
              colorScheme='gray'
              aria-label='Share'
              icon={<BiShare />}
            />
          </Flex>
          <Flex mt='4' flexDirection='column'>
          <Textarea value={comment} 
          placeholder='What are your thoughts?'
          onChange={(e) => setComment(e.target.value)}
          />
          <Button
            rounded='full'
            colorScheme='teal'
            mt='2'
            width={'15%'}
            onClick={handleCommentClick}
          >
            Comment
          </Button>
        </Flex>
        </Container>
      </GridItem>
    </Grid>
  );
}