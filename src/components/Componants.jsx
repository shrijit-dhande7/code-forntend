const MessageBanner = ({ message }) => {
  return (
    <div className="animate-pulse bg-primary text-white p-4 rounded-xl shadow-md text-center">
      {message || 'Keep coding and stay focused! 💻🚀'}
    </div>
  );
};

export default MessageBanner;
