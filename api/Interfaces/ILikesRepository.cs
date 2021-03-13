using System.Threading.Tasks;
using api.Entities;
using api.Helpers;
using api.DTOs;
using System.Collections.Generic;

namespace api.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int likedUserId); // We will retrieve the like by using the like key which is the sourceUserId and the likedUserId combined

        Task<AppUser> GetUserWithLikes(int userId);

        Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams); // This couild be a list of users that have been liked or liked by 

        Task<IEnumerable<LikeDto>> GetFullLikes (int userId);

        
     
    }
}