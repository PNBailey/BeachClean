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

    // public async Task<PagedList<EventDto>> GetPaginatedEventsAsync(EventParams eventParams)
    //     {
    //         var user = await _userRepository.GetUserByUsernameAsync(eventParams.username); 

    //         var events = _context.Events
    //         .AsQueryable()
    //         .Include(e => e.Creator)
    //         .Where(e => e.Attendees.Any(attendees => attendees.Attendee.Id == user.Id))
    //         .ProjectTo<EventDto>(_mapper.ConfigurationProvider);

    //         return await PagedList<EventDto>.CreateAsync(events, eventParams.PageNumber, eventParams.PageSize);

    //     }

        

        public async Task<List<EventDto>> GetAllEvents()
        {
            var events = await _context.Events.
            ProjectTo<EventDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

            return events;
        }

        public async Task<PagedList<EventDto>> GetUserOrganisedEvents(EventParams eventParams)
        {
            var user = await _userRepository.GetUserByUsernameAsync(eventParams.username);

            var organisedEventsquery = _context.UserEvents.AsQueryable();

            var organisedEvents = organisedEventsquery.Where(events => events.OrganiserId == user.Id);

            var organisedEventsList = organisedEvents.Select(organisedEvent => new EventDto
            {
                Name = organisedEvent.Event.Name,
                Id = organisedEvent.EventId,
                Date = organisedEvent.Event.Date,
                Location = organisedEvent.Event.Location,
                MainPhotoUrl = organisedEvent.Event.MainPhotoUrl,
                Creator = _mapper.Map<MemberDto>(organisedEvent.Event.Creator),
                Organisers = _mapper.Map<ICollection<MemberDto>>(organisedEvent.Organiser)
            });

            return await PagedList<EventDto>.CreateAsync(organisedEventsList, eventParams.PageNumber, eventParams.PageSize);


        }

        public async Task<PagedList<EventDto>> GetUserAttendedEvents(EventParams eventParams)
        {
            var user = await _userRepository.GetUserByUsernameAsync(eventParams.username);

            var AttendedEventsquery = _context.EventUsers.AsQueryable();

            var AttendedEvents = AttendedEventsquery.Where(events => events.AttendeeId == user.Id);

            var AttendedEventsList = AttendedEvents.Select(AttendedEvent => new EventDto
            {
                Name = AttendedEvent.AttendingEvent.Name,
                Id = AttendedEvent.AttendingEventId,
                Date = AttendedEvent.AttendingEvent.Date,
                Location = AttendedEvent.AttendingEvent.Location,
                MainPhotoUrl = AttendedEvent.AttendingEvent.MainPhotoUrl,
                Creator = _mapper.Map<MemberDto>(AttendedEvent.AttendingEvent.Creator),
                Organisers = _mapper.Map<ICollection<MemberDto>>(AttendedEvent.AttendingEvent.Organisers),
                Attendees = _mapper.Map<ICollection<MemberDto>>(AttendedEvent.AttendingEvent.Attendees)
            });

            return await PagedList<EventDto>.CreateAsync(AttendedEventsList, eventParams.PageNumber, eventParams.PageSize);
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