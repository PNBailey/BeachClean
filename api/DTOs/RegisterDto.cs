using System;
using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class RegisterDto
    {

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Location { get; set; }

    

    


        

       

        



    }
}