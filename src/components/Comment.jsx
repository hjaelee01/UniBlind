import { Card, CardHeader, Heading, CardBody, Text } from "@chakra-ui/react";

export function Comment({ comment, poster }) {
    return (
        <Card key={'unstyled'} variant={'unstyled'}>
          <CardHeader>
            <Heading size='md'> {poster}</Heading>
          </CardHeader>
          <CardBody>
            <Text>{comment}</Text>
          </CardBody>
        </Card>
    );
}