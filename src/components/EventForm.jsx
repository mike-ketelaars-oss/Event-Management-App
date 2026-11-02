
import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEvents } from "../Context/EventsContext";

const emptyForm = {
  title: "",
  description: "",
  image: "",
  location: "",
  startTime: "",
  endTime: "",
  categoryIds: [],
};

const toDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
};

export const EventForm = ({
  event = null,
  onClose,
  onSuccess,
}) => {
  const { categories, addEvent, updateEvent } = useEvents();

  const [form, setForm] = useState(() =>
    event
      ? {
          ...event,
          startTime: toDateTimeLocal(event.startTime),
          endTime: toDateTimeLocal(event.endTime),
        }
      : { ...emptyForm }
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleCategory = (id) => {
    setForm((previous) => ({
      ...previous,
      categoryIds: previous.categoryIds.includes(id)
        ? previous.categoryIds.filter((item) => item !== id)
        : [...previous.categoryIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.categoryIds.length === 0) {
      setError("Select at least one category.");
      return;
    }

    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setError("End time must be after start time.");
      return;
    }

    setSaving(true);

    try {
      const eventData = {
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        location: form.location.trim(),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        categoryIds: form.categoryIds,
      };

      if (event) {
        await updateEvent(event.id, eventData);
      } else {
        await addEvent({
          ...eventData,
          createdBy: 1,
        });
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      bg="white"
      color="gray.900"
      p={6}
      borderRadius="xl"
      maxH="85vh"
      overflowY="auto"
    >
      <Heading size="xl" mb={5}>
        {event ? "Edit Event" : "Add Event"}
      </Heading>

      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap={4}>
          <Box>
            <Text mb={1}>Title</Text>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </Box>

          <Box>
            <Text mb={1}>Description</Text>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </Box>

          <Box>
            <Text mb={1}>Image URL</Text>
            <Input
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              required
            />
          </Box>

          <Box>
            <Text mb={1}>Location</Text>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </Box>

          <Box>
            <Text mb={1}>Start date and time</Text>
            <Input
              name="startTime"
              type="datetime-local"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </Box>

          <Box>
            <Text mb={1}>End date and time</Text>
            <Input
              name="endTime"
              type="datetime-local"
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </Box>

          <Box>
            <Text mb={2}>Categories (choose at least one)</Text>

            <Flex gap={2} wrap="wrap">
              {categories.map((category) => {
                const selected = form.categoryIds.some(
                  (id) => String(id) === String(category.id)
                );

                return (
                  <Button
                    key={category.id}
                    type="button"
                    size="sm"
                    colorPalette="teal"
                    variant={selected ? "solid" : "outline"}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                );
              })}
            </Flex>
          </Box>

          {error && (
            <Text color="red.500" role="alert">
              {error}
            </Text>
          )}

          <Flex justify="flex-end" gap={3} mt={3}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              colorPalette="teal"
              loading={saving}
            >
              {event ? "Save Changes" : "Create Event"}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Box>
  );
};
