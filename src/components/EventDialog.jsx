
import { Dialog, Portal } from "@chakra-ui/react";
import { EventForm } from "./EventForm";

export const EventDialog = ({ open, onClose, event = null }) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      size="lg"
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {event ? "Edit Event" : "Add Event"}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <EventForm
                key={event?.id ?? "new"}
                event={event}
                onClose={onClose}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
