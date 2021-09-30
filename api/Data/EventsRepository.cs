using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Helpers;
using api.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class EventsRepository : IEventsRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        public EventsRepository(DataContext context, IMapper mapper, IUserRepository userRepository)

        {
            _userRepository = userRepository;
            _mapper = mapper;
            _context = context;
        }

        public async Task<int> CreateEvent(Event newEvent)
        {
            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();
            return newEvent.Id;

        }

        public async Task<Event> GetEventByIdAsync(int eventId)
        {
            return await _context.Events
            .Where(e => e.Id == eventId)
            .Include(e => e.Photos)
            .Include(e => e.Creator)
            .Include(e => e.Attendees)
            .ThenInclude(e => e.Attendee)
            .ThenInclude(e => e.Photo)
            .Include(e => e.Organisers)
            .ThenInclude(e => e.Organiser)
            .ThenInclude(o => o.Photo)
            .FirstOrDefaultAsync();
        }


        public async Task<PagedList<EventDto>> GetPaginatedEventsAsync(EventParams eventParams)
        {
            var user = await _userRepository.GetUserByUsernameAsync(eventParams.username);
            var events = _context.Events.AsQueryable();

            if(eventParams.predicate == "localEvents") {
            
            events = events.Where(e => e.Location == user.Location);
            
            }

            events.Include(e => e.Creator)
            .Include(e => e.Attendees)
            .ThenInclude(e => e.Attendee)
            .Include(e => e.Organisers)
            .ThenInclude(e => e.Organiser);

            var userEvents = events.ProjectTo<EventDto>(_mapper.ConfigurationProvider);
            
            return await PagedList<EventDto>.CreateAsync(userEvents, eventParams.PageNumber, eventParams.PageSize);
            

        }

        public async Task<List<EventDto>> GetAllEvents()
        {
            var events = await _context.Events.
            ProjectTo<EventDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

            return events;
        }

        public async Task<PagedList<EventDto>> GetUserEvents(EventParams eventParams)
        {
            var user = await _userRepository.GetUserByUsernameAsync(eventParams.username);

            var events = _context.Events
            .AsQueryable()
            .Where(e => e.Attendees.Any(attendees => attendees.Attendee.Id == user.Id) || e.Organisers.Any(organisers => organisers.Organiser.Id == user.Id))
            .Include(e => e.Creator)
            .Include(e => e.Attendees)
            .ThenInclude(e => e.Attendee)
            .Include(e => e.Organisers)
            .ThenInclude(e => e.Organiser)
            .ProjectTo<EventDto>(_mapper.ConfigurationProvider);

            return await PagedList<EventDto>.CreateAsync(events, eventParams.PageNumber, eventParams.PageSize);


        }


        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void updateEvent(Event updatedEvent)
        {
            _context.Entry(updatedEvent).State = EntityState.Modified;
        }

        public async Task<bool> removeOrganiser(int organiserId, int eventId)
        {
            var userEvent = await _context.UserEvents.FindAsync(organiserId, eventId);

            _context.UserEvents.Remove(userEvent);

            return true;
        }

        public async Task removeAttendee(int attendeeId, int eventId)
        {
            var eventUser = await _context.EventUsers.FindAsync(attendeeId, eventId);

            _context.EventUsers.Remove(eventUser);
        }


    }
}