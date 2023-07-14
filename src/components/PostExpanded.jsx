import { Box, Button, Container, Flex, Grid, GridItem, Heading, IconButton, Text, Textarea } from "@chakra-ui/react";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { useParams } from "react-router-dom";
import { FeedType } from "../types/FeedType";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { BiBookmark, BiChat, BiShare, BiUpvote, BiDownvote } from "react-icons/bi";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { Comment } from "./Comment";
import { nanoid } from "@reduxjs/toolkit";

export function PostExpanded() {
  const postId = useParams().postId;
  const [comment, setComment] = useState('');
  const poster = auth.currentUser.displayName;
  const [commentComponents, setCommentComponents] = useState([]);
  const [targetPost, setTargetPost] = useState(null);
  const docRef = doc(db, "posts", postId);
  const colRef = collection(docRef, "comments");
  const [voteCount, setVoteCount] = useState();

  const handleCommentClick = async() => {
    const commentData = {
      comment: comment,
      poster: poster
    }
    // Add comment to Firebase
    await addDoc(colRef, commentData)
    // Append the new comment to commentComponents state
    const newComment = (
      <Comment
        key={nanoid()}
        comment={commentData.comment}
        poster={commentData.poster}
      />
    );
    setCommentComponents(prevState => [...prevState, newComment]);
    setComment('');
  }

  useEffect(() => {
    // Fetch the post data from Firebase
    const fetchPostData = async () => {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTargetPost(docSnap.data());
        setVoteCount(docSnap.data().voteCount);
      } else {
        console.log("No such document!");
      }
    };

    // Fetch all comments for this post from Firebase
    const fetchCommentData = async () => {
      const querySnapshot = await getDocs(collection(docRef, "comments"));
      const comments = querySnapshot.docs.map((doc) => {
        const commentData = doc.data();
        return (
          <Comment
            key={doc.id}
            comment={commentData.comment}
            poster={commentData.poster}
          />
        );
      });
      setCommentComponents(comments);
    };

    fetchPostData();
    fetchCommentData();
  }, [postId]);

  const handleUpvote = async() => {
    setVoteCount(prevState => prevState + 1);
    await updateDoc(docRef, {
      voteCount: voteCount + 1
    })
  }
  const handleDownvote = async() => {
    setVoteCount(prevState => prevState - 1);
    await updateDoc(docRef, {
      voteCount: voteCount - 1
    })
  }

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
          {/* Original Post Content */}
          <Heading>{targetPost.title}</Heading>
          <Text>Posted by {targetPost.originalPoster}</Text>
          <p>{targetPost.text}</p>
          <Flex justify='space-between' mt='4'>
            <IconButton
              variant='ghost'
              colorScheme='gray'
              aria-label='Reply'
              icon={<BiUpvote />}
              onClick={handleUpvote}
            />
            {voteCount}
            <IconButton
              variant='ghost'
              colorScheme='gray'
              aria-label='Reply'
              icon={<BiDownvote />}
              onClick={handleDownvote}
            />
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

          {/* Comment Section */}
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

          {/* List of comments */}
          <Grid templateColumns="1fr" gap={4}>
            {/* TODO: Map docs in query snapshot to Comment component */}
            {commentComponents}
          </Grid>
        </Container>
      </GridItem>
    </Grid>
  );
}