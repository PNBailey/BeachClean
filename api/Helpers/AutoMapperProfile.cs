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

            CreateMap<Photo, PhotoDto>();

            CreateMap<MemberUpdateDto, AppUser>();

            CreateMap<Event, EventDto>();
            
        }
    }
}