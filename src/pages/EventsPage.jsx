
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  SimpleGrid,
  Image,
  Badge,
  Flex,
  Skeleton,
} from "@chakra-ui/react";
import { useEvents } from "../Context/EventsContext";

export const EventsPage = () => {
  const { events, categories, loading, error } = useEvents();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (id) => {
    setSelectedCategories((previous) =>
      previous.includes(id)
        ? previous.filter((categoryId) => categoryId !== id)
        : [...previous, id]
    );
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((id) =>
        event.categoryIds.map(String).includes(String(id))
      );

    return matchesSearch && matchesCategory;
  });

  return (
    <Box maxW="1200px" mx="auto" p={{ base: 4, md: 8 }}>
      <Heading size="3xl" mb={3}>
        Discover Events
      </Heading>

      <Text color="gray.500" mb={6}>
        Find activities, discover new experiences and join the fun.
      </Text>

      <Input
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb={5}
      />

      <Flex gap={2} wrap="wrap" mb={8}>
        {categories.map((category) => (
          <Button
            key={category.id}
            size="sm"
            variant={
              selectedCategories.includes(category.id)
                ? "solid"
                : "outline"
            }
            colorPalette="teal"
            onClick={() => toggleCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </Flex>

      {error && (
        <Text color="red.500" mb={5}>
          Error: {error}
        </Text>
      )}

      {loading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {[1, 2, 3, 4, 5, 6].map((number) => (
            <Box key={number}>
              <Skeleton height="200px" mb={3} />
              <Skeleton height="24px" mb={2} />
              <Skeleton height="16px" />
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {filteredEvents.map((event) => (
            <Box
              key={event.id}
              borderWidth="1px"
              borderRadius="xl"
              overflow="hidden"
              _hover={{ shadow: "lg" }}
            >
              <Image
                src={event.image}
                alt={event.title}
                width="100%"
                height="200px"
                objectFit="cover"
              />

              <Box p={5}>
                <Flex gap={2} mb={3} wrap="wrap">
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

                <Heading size="lg" mb={2}>
                  {event.title}
                </Heading>

                <Text mb={3}>{event.description}</Text>

                <Text fontSize="sm" color="gray.500" mb={4}>
                  {new Date(event.startTime).toLocaleString()}
                </Text>

                <RouterLink to={`/event/${event.id}`}>
                  <Button colorPalette="teal">
                    View Event
                  </Button>
                </RouterLink>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {!loading && !error && filteredEvents.length === 0 && (
        <Text mt={6}>No events found.</Text>
      )}
    </Box>
  );
};
