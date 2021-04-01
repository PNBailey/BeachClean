using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    public class EventsController : BaseApiController
    {
        private readonly IEventsRepository _eventsRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IUserRepository _userRepository;
        public EventsController(IEventsRepository eventsRepository, IMapper mapper, IPhotoService photoService, IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _photoService = photoService;
            _mapper = mapper;
            _eventsRepository = eventsRepository;

        }

        // [HttpPost]
        // public async Task<ActionResult<int>> CreateEvent(EventDto newEvent)
        // {

        //     var currUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        //     var events = await _eventsRepository.GetEventsAsync();

        //     var matchingDates = events.Where(e => e.Date == newEvent.Date);

        //     var matchingEvents = matchingDates.Where(e => e.Name == newEvent.Name);

        //     if (matchingEvents.Count() > 0)
        //     {
        //         return BadRequest("Event already exists!");
        //     }

        //     // if(newEvent.MainPhoto != null) {
        //     //     var mainEventPhoto = new Photo {
        //     //     Url = newEvent.MainPhoto.url
        //     // };
        //     // }
            
        // //    var newEventDate = newEvent.Date.ToShortDateString();
           
        //     var createdEvent = new Event
        //     {
        //         Name = newEvent.Name,
        //         Date = newEvent.Date,
        //         Location = newEvent.Location,
        //         Creator = currUser,
        //         CreatorId = currUser.Id

        //     };

        //    return await _eventsRepository.CreateEvent(createdEvent);

        // }

        [HttpGet("{id}", Name = "GetEvent")]

        public async Task<ActionResult<EventDto>> GetEventById(int id)
        {
            var existingEvent = await _eventsRepository.GetEventByIdAsync(id);

            var existingEventDto = _mapper.Map<Event, EventDto>(existingEvent);

            return existingEventDto;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetAllEvents([FromQuery] EventParams eventParams)
        {
            var events = await _eventsRepository.GetEventsAsync(eventParams);

            Response.AddPaginationHeader(events.CurrentPage, eventParams.PageSize, events.TotalCount, events.TotalPages);

            return Ok(events);
        }

        [HttpPost("add-photo/{id}")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file, int id)
        {
            var existingEvent = await _eventsRepository.GetEventByIdAsync(id);

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new EventPhoto
            {
                Url = result.SecureUrl.AbsoluteUri,
                publicId = result.PublicId

            };

            if(existingEvent.Photos.Count == 0) {
                photo.MainPhoto = true;
                existingEvent.MainPhotoUrl = photo.Url;
            }

            existingEvent.Photos = existingEvent.Photos ?? new List<EventPhoto>();
            existingEvent.Photos.Add(photo);

            if (await _eventsRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetEvent", new { id = existingEvent.Id }, _mapper.Map<EventPhoto, PhotoDto>(photo));
            }

            return BadRequest("Unable to upload photo");
        }

        [HttpPut]

        public async Task<ActionResult> updateEvent (eventUpdateDto updatedEvent) 
        {
            var existingEvent = await _eventsRepository.GetEventByIdAsync(updatedEvent.Id);

            if(updatedEvent.Date == null)
            {
                updatedEvent.Date = existingEvent.Date;
            }

            _mapper.Map(updatedEvent, existingEvent);

            _eventsRepository.updateEvent(existingEvent);

            if(await _eventsRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Unable to update event");


        }

        [HttpPut("set-main-photo/{eventId}")]
        
        public async Task<ActionResult> setMainPhoto(int eventId, PhotoDto photo)
        {
            // 1. get existing event
            var existingEvent = await _eventsRepository.GetEventByIdAsync(eventId);

            //2. change existing event mainPhotoUrl to image Url passed into this method
            existingEvent.MainPhotoUrl = photo.url;

            //3. get the main photo
             var currMainPhoto = existingEvent.Photos.FirstOrDefault(p => p.MainPhoto);

             //4. set currMainPhoto to false
             if(currMainPhoto != null) currMainPhoto.MainPhoto = false;

             // 5. get new main photo
             var newMainPhoto = existingEvent.Photos.FirstOrDefault(p => p.Url == photo.url);

            if(newMainPhoto.MainPhoto) return BadRequest("This is already your main photo");

             //6. set new main photo to main photo
             newMainPhoto.MainPhoto = true;

             //7. update event usng repo method 
             if(await _eventsRepository.SaveAllAsync()) return NoContent();

             return BadRequest("Unable to update main photo on server");
        }

    [HttpDelete("deletePhoto/{eventId}/{photoId}")]
    public async Task<ActionResult> deletePhoto(int eventId, int photoId)  
    
    {
        //get existg event
        
        var existingEvent = await _eventsRepository.GetEventByIdAsync(eventId);

        //1. get public id of photo

        var photoToDelete = existingEvent.Photos.FirstOrDefault(p => p.Id == photoId);

        // delete from main photo on event if it is the main photo

        if(existingEvent.MainPhotoUrl == photoToDelete.Url) existingEvent.MainPhotoUrl = null;

        // delete from cloudinary 

        if(photoToDelete == null) return BadRequest("Photo already deleted");
        
        await _photoService.DeletePhotoAsync(photoToDelete.publicId);

        // delete from event

        existingEvent.Photos.Remove(photoToDelete);

        // update event

        if(await _eventsRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Unable to delete photo");

    }

    [HttpPut("add-organiser/{eventId}/{organiserId}")]
    public async Task<ActionResult> addOrganiser(int eventId, int organiserId)    
    {
        var existingEvent = await _eventsRepository.GetEventByIdAsync(eventId);

        var organiser = await _userRepository.GetUserByIdAsync(organiserId);

        var userEvent = new UserEvents {
            OrganiserId = organiserId,
            EventId = eventId
        };

        existingEvent.Organisers = existingEvent.Organisers ?? new List<UserEvents>();

        existingEvent.Organisers.Add(userEvent);

        if(await _eventsRepository.SaveAllAsync()) return Ok();

        return BadRequest("Failed to add organiser");

    }

    [HttpDelete("removeOrganiser/{eventId}/{organiserid}")]
    public async Task<ActionResult> removeOrganiser(int eventId, int organiserId) 
    {
        var existingEvent = await _eventsRepository.GetEventByIdAsync(eventId);

        var organiser = await _userRepository.GetUserByIdAsync(organiserId);

        await _eventsRepository.removeOrganiser(organiserId, eventId);

         if(await _eventsRepository.SaveAllAsync()) return Ok();

        return BadRequest("Failed to remove organiser"); 
    }

    [HttpPut("add-attendee/{eventId}/{attendeeUsername}")]
    public async Task<ActionResult> addAttendee(int eventId, string attendeeUsername) 
    {
        var attendee = await _userRepository.GetUserByUsernameAsync(attendeeUsername);

        var existingEvent = await _eventsRepository.GetEventByIdAsync(eventId);

        var eventUser = new EventUsers {
            AttendeeId = attendee.Id,
            AttendingEventId = eventId
        };

       var existingEventTest = existingEvent.Attendees.FirstOrDefault(x => x == eventUser); 

       if(existingEventTest != null) return BadRequest("Already attending event");

       existingEvent.Attendees = existingEvent.Attendees ?? new List<EventUsers>();

        existingEvent.Attendees.Add(eventUser);

        if(await _eventsRepository.SaveAllAsync()) return Ok();

        return BadRequest("Failed to add attendee");
    }
        

    }
}