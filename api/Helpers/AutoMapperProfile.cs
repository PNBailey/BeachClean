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
        public AutoMapperProfile() {
            CreateMap<AppUser, MemberDto>();

            CreateMap<MemberDto, AppUser>();

            CreateMap<UserPhoto, PhotoDto>();

            CreateMap<PhotoDto, UserPhoto>();

            CreateMap<EventPhoto, PhotoDto>();

            CreateMap<PhotoDto, EventPhoto>();

            CreateMap<MemberUpdateDto, AppUser>();

            CreateMap<Event, EventDto>();

            CreateMap<EventDto, Event>();

            CreateMap<ICollection<AppUser>, ICollection<MemberDto>>();

            CreateMap<EventUsers, MemberDto>();

            CreateMap<UserEvents, MemberDto>();
            
        }
    }
}