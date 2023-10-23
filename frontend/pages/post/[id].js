import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import {
  Input,
  Button,
  Flex,
  Card,
  CardBody,
  CardHeader,
  Stack,
  Heading,
  Text,
  StackDivider,
  Box,
} from "@chakra-ui/react";
import { useUser } from "../../useUser";
import { useToast } from "@chakra-ui/react";

export default function Post() {
  const router = useRouter();
  const user = useUser((state) => state.user);
  const [post, setPost] = React.useState(null);
  const [comment, setComment] = React.useState("");
  const toast = useToast();

  useEffect(() => {
    fetch("http://localhost:5000/post/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: router.query.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => setPost(data));
  }, [router.query.id]);

  console.log(post);

  console.log(router.query.id);

  const handleDeletePost = async () => {
    if (!user) {
      return;
    }
    const response = await fetch("http://localhost:5000/post/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: router.query.id,
        userId: !user ? "" : user._id,
      }),
    });
    const data = await response.json();

    console.log(data);

    if (response.status === 201) {
      router.push("/");
    } else {
      if (data.message === "Only the author can delete a post") {
        toast({
          title: "Delete Post failed",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: "Delete Post failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateComment = async () => {
    console.log("comment");
    if (!user) {
      return;
    }
    const response = await fetch("http://localhost:5000/comment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: router.query.id,
        userId: !user ? "" : user._id,
        content: comment,
      }),
    });
    const data = await response.json();

    console.log(data);

    if (response.status === 201) {
      router.push("/");
    } else {
      toast({
        title: "Create comment failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout>
      {post ? (
        <Box>
          {" "}
          <Card mt={2}>
            <CardHeader>
              <Heading size="md">{post.title}</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Text fontSize="sm">
                    Posted by {post.author[0].username} on {post.createdAt}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Content
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {post.content}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Categories
                  </Heading>
                  <Flex>
                    {post.categories.map((category) => (
                      <Text ml={1.5} pt="2" fontSize="sm">
                        {category}
                      </Text>
                    ))}
                  </Flex>
                </Box>
              </Stack>
              <Flex mt={2}>
                <Button colorScheme="red" mr={2} onClick={handleDeletePost}>
                  Delete Post
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Flex mt={4}>
            <Input
              pr="4.5rem"
              type={"text"}
              placeholder="Type out a comment"
              value={comment}
              onChange={(change) => setComment(change.target.value)}
            />
            <Button ml={2} onClick={handleCreateComment}>
              Comment
            </Button>
          </Flex>
          {post
            ? post.comments.map((comment) => (
                <Box mt={6}>
                  <Heading size="xs" textTransform="uppercase">
                    Comment by {comment.author[0].username} on{" "}
                    {comment.createdAt}
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {comment.content}
                  </Text>
                </Box>
              ))
            : null}
        </Box>
      ) : null}
    </Layout>
  );
}
