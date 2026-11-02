
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { EventForm } from "./EventForm";

export const Navigation = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      <Box as="nav" borderBottomWidth="1px" px={5} py={4}>
        <Flex
          maxW="1200px"
          mx="auto"
          justify="space-between"
          align="center"
          gap={3}
          wrap="wrap"
        >
          <RouterLink to="/">
            <Heading size="lg">Event Manager</Heading>
          </RouterLink>

          <Flex gap={2} wrap="wrap">
            <RouterLink to="/">
              <Button variant="ghost">Events</Button>
            </RouterLink>

            <RouterLink to="/about">
              <Button variant="ghost">About</Button>
            </RouterLink>

            <Button
              colorPalette="teal"
              onClick={() => setShowAddModal(true)}
            >
              Add Event
            </Button>
          </Flex>
        </Flex>
      </Box>

      {message && (
        <Box
          role="status"
          bg="green.100"
          color="green.900"
          p={3}
          textAlign="center"
        >
          <Flex justify="center" align="center" gap={3}>
            <Text>{message}</Text>
            <Button
              size="xs"
              variant="outline"
              onClick={() => setMessage("")}
            >
              Close
            </Button>
          </Flex>
        </Box>
      )}

      {showAddModal && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.700"
          zIndex={1000}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box width="100%" maxW="600px">
            <EventForm
              onClose={() => setShowAddModal(false)}
              onSuccess={() =>
                setMessage("Event successfully added!")
              }
            />
          </Box>
        </Box>
      )}
    </>
  );
};
