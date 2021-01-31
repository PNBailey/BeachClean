using System.Threading.Tasks;
using api.Entities;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace api.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> AddPhotoAsync(IFormFile file);

        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}