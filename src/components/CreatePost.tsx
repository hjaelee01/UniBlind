import { Stack, Input, Textarea, Box, Flex, FormControl, Grid, GridItem, Select, Button } from '@chakra-ui/react';
import { Header } from './Header';
import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { postSubmit } from '../redux/feedSlice';
import { useNavigate } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import React from 'react';
import { auth } from '../firebase';


export function CreatePost() {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }
  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }
  const navigate = useNavigate();
  const handlePostClick = () => {
    if (title) {
      // If the user clicks the button, it dispatches an action with the payload of the form {title, text}
      dispatch(
        postSubmit(
          ({postId: nanoid(),
            title,
              text,
              voteCount: 0
            })
        )
      )
      setTitle('');
      setText('');
      // also, it navigates to Main component.
      navigate('/')
    }
  }
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