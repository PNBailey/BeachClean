using System.Collections.Generic;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Helpers;

namespace api.Interfaces
{
    public interface IEventsRepository
    {
        Task<int> CreateEvent(Event newEvent);

        Task<PagedList<EventDto>> GetPaginatedEventsAsync(EventParams eventParams);

        Task<List<EventDto>> GetAllEvents();

        Task<Event> GetEventByIdAsync(int eventId);

        Task<PagedList<EventDto>> GetUserOrganisedEvents(EventParams eventParams);

        Task<PagedList<EventDto>> GetUserAttendedEvents(EventParams eventParams);

        Task<bool> SaveAllAsync();

        void updateEvent(Event updatedEvent);

        Task<bool> removeOrganiser(int organiserId,  int eventId);

        Task removeAttendee(int attendeeId,  int eventId);


        
    }
}