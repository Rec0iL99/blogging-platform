import React, { useEffect } from "react";
import { useUser } from "../../useUser";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Textarea,
} from "@chakra-ui/react";
import Layout from "../../components/Layout";

export default function EditPost() {
  const router = useRouter();
  const user = useUser((state) => state.user);
  const [post, setPost] = React.useState(null);
  const toast = useToast();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const [category, setCategory] = React.useState("");
  const [data, setData] = React.useState(null);

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
      .then((data) => {
        console.log("data: ", data);
        setData(data);
      });
  }, [router.query.id]);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContent(data.content);
      setCategories(data.categories);
      setPost(data);
    }
  }, [data]);

  const handleClick = () => {
    if (category) {
      setCategories((prevCategories) => [...prevCategories, category]);
      setCategory("");
    }
  };

  const handleEditPost = async () => {
    console.log(user);
    console.log(title, content, categories);
    if (!router.query.id || !user) {
      return;
    }

    const response = await fetch("http://localhost:5000/post/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: !router.query.id ? "" : router.query.id,
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
      console.log(data);
      if (data.message === "Only the author can update this post") {
        toast({
          title: "Edit Post failed",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      toast({
        title: "Edit Post failed",
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
      <Button mt="2" size="md" onClick={handleEditPost}>
        Edit Post
      </Button>
    </Layout>
  );
}
