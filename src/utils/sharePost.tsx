import React, { useState } from 'react';
import { Button, Flex, Icon, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { BiLink, BiShare } from 'react-icons/bi';
import { useLocation } from 'react-router-dom';

interface SharePostProps {
  postId: string;
}

const SharePost: React.FC<SharePostProps> = ({ postId }) => {
  const [showLinkCopied, setShowLinkCopied] = useState(false);
  const location = useLocation();

  const handleShareClick = () => {
    if (location.pathname === '/') {
      navigator.clipboard.writeText(`${window.location.href}posts/${postId}`);
    } else if (location.pathname === `/posts/${postId}`) {
      navigator.clipboard.writeText(`${window.location.href}`);
    }
    setShowLinkCopied(true);
    setTimeout(() => {
      setShowLinkCopied(false);
    }, 3000);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" leftIcon={<BiShare />} />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Flex justifyContent="center">
            <div className="container">
              <Button colorScheme="teal" onClick={handleShareClick}>
                Copy Link
              </Button>
              {showLinkCopied && (
                <div className="linkCopied">
                  <span>
                    <Icon as={BiLink} />
                    Link copied
                  </span>
                </div>
              )}
            </div>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SharePost;