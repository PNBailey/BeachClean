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
            var events = _context.Events.OrderByDescending(existingEvent => existingEvent.Organisers.Count).AsQueryable()
            .Include(e => e.Creator)
            .Include(e => e.Photos)
            .Include(e => e.Attendees)
            .ThenInclude(e => e.Attendee)
            .ThenInclude(e => e.Photo)
            .Include(e => e.Organisers)
            .ThenInclude(e => e.Organiser)
            .ThenInclude(o => o.Photo)
            .ProjectTo<EventDto>(_mapper.ConfigurationProvider);

            return await PagedList<EventDto>.CreateAsync(events, eventParams.PageNumber, eventParams.PageSize);

        }

        public async Task<List<EventDto>> GetAllEvents()
        {
            var events = await _context.Events.
            ProjectTo<EventDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

            return events;
        }

        public async Task<List<EventDto>> GetUserOrganisedEvents(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);

            var query = _context.UserEvents.AsQueryable();

            var existingEvents = query.Where(events => events.OrganiserId == user.Id);

            var events = existingEvents.Select(existingEvent => new EventDto{
                Name = existingEvent.Event.Name,
                Id = existingEvent.EventId,
                Date = existingEvent.Event.Date,
                Location = existingEvent.Event.Location,
                MainPhotoUrl = existingEvent.Event.MainPhotoUrl,
                Creator = _mapper.Map<MemberDto>(existingEvent.Event.Creator),
                Organisers = _mapper.Map<ICollection<MemberDto>>(existingEvent.Event.Organisers),
                Attendees = _mapper.Map<ICollection<MemberDto>>(existingEvent.Event.Attendees)
            }).ToListAsync();

            return await events;

          

            

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