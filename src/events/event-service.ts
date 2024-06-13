import { SortOrder } from "mongoose";
import { CreateEventDto } from "./dtos/CreateEvent.dot";
import EventModel, { IEvent } from "./models/Event";

// this event service instance shows how to create a event, get a event by id, and get all events with in-memory data
class EventService {
  async getEventById(id: string): Promise<IEvent | null> {
    return await EventModel.findById(id).exec();
  }

  async getEvents(
    page: number,
    limit: number,
    sortBy: string,
    sortDirection: "asc" | "desc",
    city?: string
  ): Promise<IEvent[]> {
    const skip = (page - 1) * limit;
    const sortOptions: { [key: string]: SortOrder } = {
      [sortBy]: sortDirection === "asc" ? 1 : -1,
    };

    const filter = { location: city?.toLowerCase() };

    return await EventModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
    const { name, description, date, location, duration } = createEventDto;
    const newEvent = new EventModel({
      name,
      description,
      date: new Date(date),
      location: location.toLowerCase(),
      duration,
    });

    await newEvent.save();
    return newEvent;
  }
}

export default EventService;
