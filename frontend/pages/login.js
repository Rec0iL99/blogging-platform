import React from "react";
import Layout from "../components/Layout";
import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { useUser } from "../useUser";

export default function Login() {
  const router = useRouter();
  const toast = useToast();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const addUser = useUser((state) => state.addUser);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    const response = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    addUser(data.user);
    console.log(data);

    if (response.status === 201) {
      router.push("/");
    } else {
      toast({
        title: "Login failed",
        description: "Your credentials were not right",
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
        placeholder="Enter email"
        value={email}
        onChange={(change) => setEmail(change.target.value)}
      />
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Enter password"
          value={password}
          onChange={(change) => setPassword(change.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
      <Button mt="2" size="md" onClick={handleLogin}>
        Login
      </Button>
    </Layout>
  );
}
