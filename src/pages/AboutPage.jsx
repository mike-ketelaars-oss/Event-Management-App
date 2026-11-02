
import { Box, Heading, Text } from "@chakra-ui/react";

export const AboutPage = () => {
  return (
    <Box maxW="900px" mx="auto" p={{ base: 4, md: 8 }}>
      <Heading size="3xl" mb={5}>
        About Event Manager
      </Heading>

      <Text fontSize="lg" mb={4}>
        Welcome to Event Manager!
      </Text>

      <Text mb={4}>
        This application helps you discover, create,
        edit and manage events.
      </Text>

      <Text color="gray.500">
        Built with React, Chakra UI, React Router
        and JSON Server as part of the Winc Academy
        Advanced React project.
      </Text>
    </Box>
  );
};
