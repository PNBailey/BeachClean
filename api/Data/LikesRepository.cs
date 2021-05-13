using System.Linq;
using System.Threading.Tasks;
using api.Entities;
using api.DTOs;
using api.Helpers;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace api.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;
        public LikesRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, likedUserId);

        }

        public async Task<IEnumerable<LikeDto>> GetFullLikes(int userId) 
        {
            var users = _context.Users.OrderBy(user => user.UserName).AsQueryable();

            var likes = _context.Likes.AsQueryable();

            likes = likes.Where(like => like.SourceUserId == userId);

            users = likes.Select(like => like.LikedUser);

              var likedUsers = users.Select(user => new LikeDto
            {
                UserName = user.UserName,
                Name = user.Name,
                Id = user.Id,
                PhotoUrl = user.Photo.Url,
                Location = user.Location
            });

            return await likedUsers.ToListAsync();

        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            var users = _context.Users.OrderBy(user => user.UserName).AsQueryable();

            var likes = _context.Likes.AsQueryable();

            if (likesParams.Predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == likesParams.UserId);

                users = likes.Select(like => like.LikedUser);
            }

            if (likesParams.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == likesParams.UserId);

                users = likes.Select(like => like.SourceUser);

            }

            var likedUsers = users.Select(user => new LikeDto
            {
                UserName = user.UserName,
                Name = user.Name,
                Id = user.Id,
                PhotoUrl = user.Photo.Url,
                Location = user.Location
            });

          
                return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);

        }

           public async void DeleteLike(int userId, int friendId)
        {

            var userLike = await _context.Likes.FindAsync(userId, friendId);

            _context.Likes.Remove(userLike);

        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
                .Include(user => user.LikedUsers)
                .FirstOrDefaultAsync(user => user.Id == userId);

        }

         public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

     
    }
}