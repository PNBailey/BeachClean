namespace api.errors
{
    public class ApiException
    {
        private readonly int _StatusCode;
        private readonly string _Message;
        private readonly string _Details;
        public ApiException(int StatusCode, string Message = null, string Details = null)
        {
            _Details = Details;
            _Message = Message;
            _StatusCode = StatusCode;

        }

        public int StatusCode { get; set; }

        public string Message { get; set; }

        public string Details { get; set; }
    }
}