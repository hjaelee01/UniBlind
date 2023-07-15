import { Card,
         CardHeader, 
         CardBody, 
         CardFooter, 
         Flex, 
         Box,
         Heading,
         Text,
         IconButton,
         Image,
         Button } from '@chakra-ui/react'
import { BsThreeDotsVertical  } from "react-icons/bs";
import { BiUpvote,BiDownvote, BiChat, BiShare } from "react-icons/bi";
import { useDispatch } from 'react-redux';
import { PostType } from '../types/PostType';
import { downvote, upvote } from '../redux/feedSlice';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export function Post({originalPoster, postId, title, text, voteCount}: PostType) {
  const dispatch = useDispatch();
  const user = auth.currentUser;
  const displayName = user?.displayName!;
  const [updatedVoteCount, setUpdatedVoteCount] = useState<number>(voteCount);
  const VoteStatus = {
    UPVOTED: 'upvoted',
    DOWNVOTED: 'downvoted',
    NONE: 'none'
  };

  // Check if user has voted
  const [voteStatus, setVoteStatus] = useState<string>(VoteStatus.NONE);
  useEffect(() => {
    if (user) {
      const checkVoteStatus = async() => {
        const docRef = doc(db, "users", displayName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.upvotedPosts.includes(postId)) {
            setVoteStatus(VoteStatus.UPVOTED);
          } else if (data?.downvotedPosts.includes(postId)) {
            setVoteStatus(VoteStatus.DOWNVOTED);
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }
      checkVoteStatus();
    }
  }, [user, postId]);

  // Making the votecount update in real time
  const handleUpvote = async() => {
    if (user) {
      const docRef = doc(db, "users", displayName);
      dispatch(upvote({postId: postId}));
      setUpdatedVoteCount(updatedVoteCount + 1);
      await updateDoc(doc(db, "posts", postId), {
        voteCount: updatedVoteCount + 1
      });
      switch (voteStatus) {
        case VoteStatus.UPVOTED:
          await updateDoc(docRef, {
            upvotedPosts: arrayRemove(postId)
          })
          setVoteStatus(VoteStatus.NONE);
          break;
        case VoteStatus.DOWNVOTED:
          await updateDoc(docRef, {
            upvotedPosts: arrayUnion(postId),
            downvotedPosts: arrayRemove(postId)
          });
          setVoteStatus(VoteStatus.UPVOTED);
          break;
        case VoteStatus.NONE:
          await updateDoc(docRef, {
            upvotedPosts: arrayUnion(postId)
          });
          setVoteStatus(VoteStatus.UPVOTED);
          break;
      }
    } else {
      alert('Sign in to upvote!');
    }
  }
  const handleDownvote = async() => {
    if (user) {
      dispatch(downvote({postId: postId}));
      setUpdatedVoteCount(updatedVoteCount - 1);
      await updateDoc(doc(db, "posts", postId), {
        voteCount: updatedVoteCount - 1
      });
    } else {
      alert('Sign in to downvote!');
    }
  }

  return (
    <Card maxW='md' marginBottom={'20px'} width={'40vw'}>
      <Flex gap='4' flexDirection='row'>
        <Box flexBasis='20%' pr={1}>
          <Flex flexDirection='column' alignItems='center'>
            <Button variant='ghost' leftIcon={<BiUpvote />} onClick={handleUpvote}></Button>
            {updatedVoteCount}
            <Button variant='ghost' leftIcon={<BiDownvote />} onClick={handleDownvote}></Button>
          </Flex>
        </Box>
        <Box flexBasis='80%'>
          <CardHeader>
            <Flex gap='4'>
              <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                <Box>
                  <Heading size='lg'>{title}</Heading>
                  <Text fontSize='sm'>{originalPoster}</Text>
                </Box>
              </Flex>
              <IconButton
                variant='ghost'
                colorScheme='gray'
                aria-label='See menu'
                icon={<BsThreeDotsVertical />}
              />
            </Flex>
          </CardHeader>
          <CardBody>
            <Link to={`/posts/${postId}`}>
              <Text >
                {text}
              </Text>
            </Link>
          </CardBody>
          {/* TODO: Upload image from device feature */}
          <CardFooter justify='space-between' display='flex'>
            <Link to={`/posts/${postId}`}>
              <Button variant='ghost' leftIcon={<BiChat />}></Button>
            </Link>
            <Button variant='ghost' leftIcon={<BiShare />}></Button>
          </CardFooter>
        </Box>
      </Flex>
    </Card>
  );  
}