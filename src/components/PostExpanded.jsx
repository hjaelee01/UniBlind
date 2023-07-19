import { Box, Button, Container, Flex, Grid, GridItem, Heading, IconButton, Text, Textarea } from "@chakra-ui/react";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { useParams } from "react-router-dom";
import { FeedType } from "../types/FeedType";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { BiBookmark, BiChat, BiShare, BiUpvote, BiDownvote, BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { Comment } from "./Comment";
import { nanoid } from "@reduxjs/toolkit";
import SharePost from "../utils/sharePost";
import { useVote } from "../utils/useVote";

export function PostExpanded() {
  const postId = useParams().postId;
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null);
  const [poster, setPoster] = useState('');
  const [commentComponents, setCommentComponents] = useState([]);
  const [targetPost, setTargetPost] = useState(null);
  const docRef = doc(db, "posts", postId);
  const colRef = collection(docRef, "comments");
  const { updatedVoteCount, handleUpvote, handleDownvote, voteStatus } = useVote(postId);
  const [upvoteIcon, setUpvoteIcon] = useState(voteStatus === 'upvoted' ? <BiUpvote /> : <BiUpvote />);
  const [downvoteIcon, setDownvoteIcon] = useState(voteStatus === 'downvoted' ? <BiDownvote /> : <BiDownvote />);

  // Listen for changes in the authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setPoster(user.displayName);
      } else {
        setUser(null);
        setPoster('');
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  // Fill/Unfill the icons based on the vote status
  useEffect(() => {
    if (voteStatus === 'upvoted') {
      setUpvoteIcon(<BiSolidUpvote />);
      setDownvoteIcon(<BiDownvote />);
    } else if (voteStatus === 'downvoted') {
      setUpvoteIcon(<BiUpvote />);
      setDownvoteIcon(<BiSolidDownvote />);
    } else {
      setUpvoteIcon(<BiUpvote />);
      setDownvoteIcon(<BiDownvote />);
    }
  }, [voteStatus]);

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
              icon={upvoteIcon}
              onClick={handleUpvote}
            />
            {updatedVoteCount}
            <IconButton
              variant='ghost'
              colorScheme='gray'
              aria-label='Reply'
              icon={downvoteIcon}
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
              // TODO: Implement save functionality
            />
            <SharePost postId={postId} />
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