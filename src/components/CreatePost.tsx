import { Stack, Input, Textarea, Box, Flex, FormControl, Grid, GridItem, Select, Button } from '@chakra-ui/react';
import { Header } from './Header';
import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { postSubmit } from '../redux/feedSlice';
import { useNavigate } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { PostType } from '../types/PostType';


export function CreatePost() {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const postId = nanoid();
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }
  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }
  const navigate = useNavigate();
  const handlePostClick = async () => {
    // Check if the title is empty
      const user = auth.currentUser;
      const postData: PostType = {
        originalPoster: user?.displayName || 'Anonymous',
        postId: postId,
        title: title,
        text: text,
        voteCount: 0
      };
      try {
        // Dispatch an action to submit the post data
        dispatch(postSubmit(postData));
        // Save the post data to Firestore
        await setDoc(doc(db, "posts", postId), postData);
        // Reset the form fields
        setTitle('');
        setText('');
      
        // Navigate to the desired component
        navigate('/');
      } catch (error) {
        console.error('Error saving post to Firestore:', error);
      }
  };
  const dispatch = useDispatch();
  const isTitleEmpty = title.trim() === ''

  return (
    <Grid
       templateAreas={`"header"
                       "box"`}
       gridTemplateRows={'100px 1fr'}
       h='100vh'
       gap='1'
       color='blackAlpha.700'
       fontWeight='bold'
    >
      <GridItem pl='2' area={'header'}>
        <Header />
      </GridItem>
      <GridItem area={'box'}>
        <Flex
          flexDirection="column"
          width="100vw"
          height="100vh"
          backgroundColor="gray.200"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            width="50%"
            backgroundColor="white"
            p="1rem"
            boxShadow="md"
          >
            <Stack spacing={0}>
              <FormControl>
                <Input value={title} placeholder="Title" mb="15px" onChange={handleTitleChange} />
                <Textarea value={text} placeholder='Text(Optional)' height="200px" mb="15px" onChange={handleTextChange} />
              </FormControl>
              <Flex justify="space-between">
                <Select placeholder='Choose a channel' w='300px'>
                  <option value='option1'>General</option>
                  <option value='option2'>Courses</option>
                  <option value='option3'>Announcements</option>
                  <option value='option4'>Career</option>
                </Select>
                <Button colorScheme='teal' 
                  size='md' 
                  w='70px' 
                  bg={isTitleEmpty ? 'gray.400' : 'teal.500'}
                  disabled={title.trim() === ''}
                  onClick={handlePostClick}>
                  Post
                </Button>
              </Flex>
            </Stack>
          </Box>
        </Flex>
      </GridItem>
    </Grid>
  );
}