import React from "react";
import Layout from "../components/Layout";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { useUser } from "../useUser";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";

export default function CreatePost() {
  const router = useRouter();
  const user = useUser((state) => state.user);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const [category, setCategory] = React.useState("");
  const toast = useToast();

  const handleClick = () => {
    if (category) {
      setCategories((prevCategories) => [...prevCategories, category]);
      setCategory("");
    }
  };

  const handleCreatePost = async () => {
    console.log(user);
    console.log(title, content, categories);
    const response = await fetch("http://localhost:5000/post/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        categories,
        userId: !user ? "" : user._id,
      }),
    });
    const data = await response.json();

    if (response.status === 201) {
      router.push("/");
    } else {
      toast({
        title: "Create Post failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout>
      <Input
        pr="4.5rem"
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(change) => setTitle(change.target.value)}
      />
      <Textarea
        pr="4.5rem"
        placeholder="Enter content"
        value={content}
        onChange={(change) => setContent(change.target.value)}
      />
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={"text"}
          placeholder="Add a category"
          value={category}
          onChange={(change) => setCategory(change.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            disabled={!!category}
            onClick={handleClick}
          >
            Add
          </Button>
        </InputRightElement>
      </InputGroup>
      <Button mt="2" size="md" onClick={handleCreatePost}>
        Create Post
      </Button>
    </Layout>
  );
}
