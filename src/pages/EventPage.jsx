
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Image,
  Badge,
  Flex,
  Button,
  Skeleton,
} from "@chakra-ui/react";
import { useEvents } from "../Context/EventsContext";

export const EventPage = () => {
  const { eventId } = useParams();
  const { events, categories, loading, error } = useEvents();

  const event = events.find(
    (item) => String(item.id) === String(eventId)
  );

  if (loading) {
    return (
      <Box maxW="900px" mx="auto" p={8}>
        <Skeleton height="350px" mb={5} />
        <Skeleton height="40px" mb={4} />
        <Skeleton height="100px" />
      </Box>
    );
  }

  if (error) {
    return <Text p={8} color="red.500">Error: {error}</Text>;
  }

  if (!event) {
    return <Text p={8}>Event not found.</Text>;
  }

  const formatDate = (date) =>
    new Date(date).toLocaleString("nl-NL", {
      dateStyle: "full",
      timeStyle: "short",
    });

  return (
    <Box maxW="900px" mx="auto" p={{ base: 4, md: 8 }}>
      <RouterLink to="/">
        <Button variant="outline" mb={6}>
          ← Back to Events
        </Button>
      </RouterLink>

      <Image
        src={event.image}
        alt={event.title}
        width="100%"
        maxHeight="450px"
        objectFit="cover"
        borderRadius="xl"
        mb={6}
      />

      <Flex gap={2} mb={4} wrap="wrap">
        {event.categoryIds.map((id) => {
          const category = categories.find(
            (item) => String(item.id) === String(id)
          );

          return category ? (
            <Badge key={id} colorPalette="teal">
              {category.name}
            </Badge>
          ) : null;
        })}
      </Flex>

      <Heading size="3xl" mb={4}>
        {event.title}
      </Heading>

      <Text fontSize="lg" mb={6}>
        {event.description}
      </Text>

      <Box borderWidth="1px" borderRadius="xl" p={5}>
        <Heading size="lg" mb={4}>
          Event Information
        </Heading>

        <Text mb={3}>
          <strong>Location:</strong> {event.location}
        </Text>

        <Text mb={3}>
          <strong>Start:</strong> {formatDate(event.startTime)}
        </Text>

        <Text>
          <strong>End:</strong> {formatDate(event.endTime)}
        </Text>
      </Box>
    </Box>
  );
};
