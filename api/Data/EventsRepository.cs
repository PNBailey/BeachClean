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
        public EventsRepository(DataContext context, IMapper mapper)
        {
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
            .Include(e => e.Organisers)
            .ThenInclude(e => e.Organiser)
            .ThenInclude(o => o.Photo)
            .FirstOrDefaultAsync();
        }

        public async Task<PagedList<EventDto>> GetEventsAsync(EventParams eventParams)
        {
            var events = _context.Events.OrderBy(existingEvent => existingEvent.Organisers.Count).Include(e => e.Organisers).ThenInclude(e => e.Organiser);

            // events
            // .Include(e => e.Creator)
            // .Include(e => e.Photos)
            // .Include(e => e.Organisers)
            // .ThenInclude(e => e.Organiser)
            // .ThenInclude(o => o.Photo)
            // .ProjectTo<EventDto>(_mapper.ConfigurationProvider);

            // var userEvents = events.Select(existingEvent => existingEvent.Organisers);

          

            var attendees = events.Select(existingEvent => existingEvent.Attendees);

            var allEvents = events.Select(existingEvent => new EventDto {
                Name = existingEvent.Name,
                Id = existingEvent.Id,
                Date = existingEvent.Date,
                Location = existingEvent.Location,
                MainPhotoUrl = existingEvent.MainPhotoUrl,
                Photos = _mapper.Map<ICollection<PhotoDto>>(existingEvent.Photos),
                Creator = _mapper.Map<MemberDto>(existingEvent.Creator),
                Organisers = _mapper.Map<ICollection<MemberDto>>(existingEvent.Organisers),
                Attendees = _mapper.Map<ICollection<MemberDto>>(existingEvent.Attendees)
            });
            
            return await PagedList<EventDto>.CreateAsync(allEvents, eventParams.PageNumber, eventParams.PageSize);

            // return await _context.Events
            // .Include(e => e.Creator)
            // .Include(e => e.Photos)
            // .Include(e => e.Organisers)
            // .ThenInclude(e => e.Organiser)
            // .ThenInclude(o => o.Photo)
            // .ProjectTo<EventDto>(_mapper.ConfigurationProvider)
            // .ToListAsync();
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
    }
}