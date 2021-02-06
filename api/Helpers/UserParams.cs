namespace API.Helpers
{

    // This class is for the parameters that the user will specify when requesting how many pages to view
    public class UserParams
    {
        private const int MaxPageSize = 50;

        public int PageNumber { get; set; } = 1;

        private int _pageSize = 10;

        public int PageSize {  // Here we set a property and modify it's getter and setter. 
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; // The 'value' here is the value of the private _pageSize field above. This will allow users to select how many results they want per page and this property will check to see if the number of results requested by the user exceeds the MaxPageSize private field we set above. If it does, we don't allow this ad we allow the user to only have the MaxPageSize which is 50. If the requested page size is below 50, then we allow the _pageSize field to be set to what the user wants. 
        }

        public string CurrentUserName { get; set; }

        public string usersLocation { get; set; }


    }
}