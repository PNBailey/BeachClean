using System.Collections.Generic;
using System.Linq;
using api.Controllers;
using api.DTOs;
using api.Entities;
using api.Extensions;
using AutoMapper;

namespace api.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<AppUser, MemberDto>();

            CreateMap<MemberDto, AppUser>();

            CreateMap<UserPhoto, PhotoDto>();

            CreateMap<PhotoDto, UserPhoto>();

            CreateMap<EventPhoto, PhotoDto>();

            CreateMap<PhotoDto, EventPhoto>();

            CreateMap<MemberUpdateDto, AppUser>();

            CreateMap<Event, EventDto>()
            .ForMember(dest => dest.Organisers, opt => opt.MapFrom(src => src.Organisers.Select(Organisers => Organisers.Organiser)))
            .ForMember(dest => dest.Attendees, opt => opt.MapFrom(src => src.Attendees.Select(Attendees => Attendees.Attendee)));

            CreateMap<EventDto, Event>();

            CreateMap<EventUsers, MemberDto>();

            CreateMap<EventUsers, EventDto>();
        
            CreateMap<UserEvents, EventDto>();
            
            CreateMap<eventUpdateDto, Event>()
                        .ForAllMembers(o => o.Condition((src, dest, value) => value != null));

            CreateMap<Message, MessageDto>();

        }
    }
}