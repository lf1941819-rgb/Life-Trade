import * as React from 'react';
import { auth } from '@/src/lib/firebase';
import { CalendarEvent } from '@/src/types';
import { eventService } from '@/src/lib/services/eventService';

export function useEvents() {
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!auth.currentUser) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    const unsubscribe = eventService.subscribeToEvents(
      auth.currentUser.uid,
      (data) => {
        setEvents(data);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser]);

  const addEvent = async (event: Omit<CalendarEvent, 'id' | 'userId'>) => {
    if (!auth.currentUser) return;
    return await eventService.createEvent({
      ...event,
      userId: auth.currentUser.uid,
    });
  };

  const updateEvent = async (id: string, event: Partial<CalendarEvent>) => {
    return await eventService.updateEvent(id, event);
  };

  const deleteEvent = async (id: string) => {
    return await eventService.deleteEvent(id);
  };

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
