
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const EventsContext = createContext(null);

const API_URL = "http://localhost:3000";

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [eventsResponse, categoriesResponse] =
        await Promise.all([
          fetch(`${API_URL}/events`),
          fetch(`${API_URL}/categories`),
        ]);

      if (!eventsResponse.ok || !categoriesResponse.ok) {
        throw new Error("Could not load events");
      }

      const eventsData = await eventsResponse.json();
      const categoriesData = await categoriesResponse.json();

      setEvents(eventsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addEvent = async (newEvent) => {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    if (!response.ok) {
      throw new Error("Could not add event");
    }

    const createdEvent = await response.json();
    setEvents((previous) => [...previous, createdEvent]);

    return createdEvent;
  };

  const updateEvent = async (id, updatedEvent) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    });

    if (!response.ok) {
      throw new Error("Could not update event");
    }

    const savedEvent = await response.json();

    setEvents((previous) =>
      previous.map((event) =>
        String(event.id) === String(id) ? savedEvent : event
      )
    );

    return savedEvent;
  };

  const deleteEvent = async (id) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Could not delete event");
    }

    setEvents((previous) =>
      previous.filter((event) => String(event.id) !== String(id))
    );
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        categories,
        loading,
        error,
        addEvent,
        updateEvent,
        deleteEvent,
        refreshEvents: fetchData,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);

  if (!context) {
    throw new Error("useEvents must be used within EventsProvider");
  }

  return context;
};
