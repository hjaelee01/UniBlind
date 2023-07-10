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
import { BiUpvote,BiDownvote } from "react-icons/bi";
import { RxChatBubble, RxShare2 } from "react-icons/rx";
import { useDispatch } from 'react-redux';
import { PostType } from '../types/PostType';
import { downvote, upvote } from '../redux/feedSlice';
import { Link } from 'react-router-dom';
import React from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

export function Post({originalPoster, postId, title, text, voteCount}: PostType) {
  const dispatch = useDispatch();
  const user = auth.currentUser;
  const handleUpvote = async() => {
    if (user) {
      dispatch(upvote({postId: postId}));
      await updateDoc(doc(db, "posts", postId), {
        voteCount: voteCount + 1
      });
    } else {
      alert('Sign in to upvote!');
    }
  }
  const handleDownvote = async() => {
    if (user) {
      dispatch(downvote({postId: postId}));
      await updateDoc(doc(db, "posts", postId), {
        voteCount: voteCount - 1
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
            {voteCount}
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
              <Button variant='ghost' leftIcon={<RxChatBubble />}></Button>
            </Link>
            <Button variant='ghost' leftIcon={<RxShare2 />}></Button>
          </CardFooter>
        </Box>
      </Flex>
    </Card>
  );  
}