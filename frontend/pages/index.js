import React, { useEffect } from "react";
import Layout from "../components/Layout";
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
import { useRouter } from "next/router";

export default function Home() {
  const [posts, setPosts] = React.useState(null);
  const [filter, setFilter] = React.useState("");
  const router = useRouter();

  const handleShowPosts = async () => {
    const response = await fetch("http://localhost:5000/post/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: filter
        ? JSON.stringify({
            filter,
          })
        : null,
    });
    const data = await response.json();
    setPosts(data);
  };

  return (
    <Layout>
      <Flex>
        <Input
          pr="4.5rem"
          type="text"
          placeholder="Enter filter"
          value={filter}
          onChange={(change) => setFilter(change.target.value)}
        />
        <Button onClick={handleShowPosts} ml={2}>
          Filter
        </Button>
        <Button
          colorScheme="teal"
          ml={2}
          onClick={() => router.push("/create-post")}
        >
          Create post
        </Button>
      </Flex>
      {posts
        ? posts.map((post) => (
            <Card cursor={"pointer"} mt={2}>
              <CardHeader onClick={() => router.push(`/post/${post._id}`)}>
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
                  <Button
                    mr={2}
                    onClick={() => router.push(`/edit-post/${post._id}`)}
                  >
                    Edit Post
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          ))
        : null}
    </Layout>
  );
}
