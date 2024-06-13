import { Request, Response } from "express";

import AuthService from "../auth/auth-service";
import { CreateEventDto } from "./dtos/CreateEvent.dot";
import EventService from "./event-service";

const authService = new AuthService();

class EventController {
  private eventService: EventService;

  constructor(eventService: EventService) {
    this.eventService = eventService;
  }

  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const createEventDto: CreateEventDto = req.body;
      const event = await this.eventService.createEvent(createEventDto);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  };

  getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      const token = authHeader?.split(" ")[1];
      const payload = token ? authService.verifyJwt(token) : null;

      console.log({ payload });

      const city = payload?.city;

      const page = parseInt(req.query.page as string) ?? 1;
      const limit = parseInt(req.query.limit as string) ?? 10;

      const sortBy = (req.query.sortBy as string) ?? "date";
      const sortDirection =
        (req.query.sortDirection as "asc" | "desc") ?? "asc";

      const events = await this.eventService.getEvents(
        page,
        limit,
        sortBy,
        sortDirection,
        city
      );

      res.status(200).json(events);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  };

  getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const event = await this.eventService.getEventById(id);
      if (!event) {
        res.status(404).json({ message: "Event not found" });
        return;
      }
      res.status(200).json(event);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  };
}

export default EventController;
