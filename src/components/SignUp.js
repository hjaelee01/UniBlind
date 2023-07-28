import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  FormControl,
  FormHelperText,
  InputRightElement
} from "@chakra-ui/react";
import { FaUserAlt, FaLock, FaKey, FaGhost } from "react-icons/fa";

import { useState } from "react";
// Required for side-effects
import "firebase/firestore";
import { signUp } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
const CFaGhost = chakra(FaGhost);

export function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const isFilled = (email !== '') && (username !== '') && (password !== '');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleJoinClick = () => {
    console.log('aaaaaaaaaa')
    if (!email.endsWith("@ed.ac.uk")) {
      setError('Please enter a valid school email address.');
      alert('Please enter a valid school email address.')
    } else {
      // Given email is school email address
      setIsCodeSent(true)
      dispatch(signUp(email, username, password, navigate));
    }
  }
  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="teal.400">Sign up</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              {/* Email address area */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input 
                  type="email" 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Your school email address" />
                </InputGroup>
              </FormControl>

              {/* Username input area */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaGhost color="gray.300" />}
                  />
                  <Input
                    type="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                  />
                  {/* 
                  TODO:
                    (check if existing username)
                    ?  <InputRightElement>
                         "Username not available" in red colour
                       </InputRightElement>
                    :  <InputRightElement>
                         "Username available!" in green colour
                       </InputRightElement>
                  */}
                </InputGroup>
                <FormHelperText textAlign="right">
                </FormHelperText>
              </FormControl>

              {/* Password input area */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                </FormHelperText>
              </FormControl>

              {/* Join button */}
              <Button
                borderRadius={0}
                variant="solid"
                colorScheme="teal"
                width="full"
                isDisabled={isFilled ? false : true}
                onClick={handleJoinClick}
              >
                Join
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};
