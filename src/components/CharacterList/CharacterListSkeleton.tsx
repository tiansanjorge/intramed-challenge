const CharacterListSkeleton = () => {
  return (
    <>
      <div className="relative flex justify-between items-center mb-6 h-10">
        <div className="flex gap-2 bg-white/90 rounded-full p-1 h-10 items-center w-56">
          <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 h-8 w-72 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
      </div>

      <div className="flex flex-wrap gap-4 items-center my-5 min-h-[2rem]">
        <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6">
        {[0, 1].map((_, side) => (
          <div key={side} className="lg:mx-0 mx-auto max-w-[31.75rem] w-full">
            <div className="flex items-center justify-between mb-2 h-8">
              <div className="h-5 w-32 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-8 w-28 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-[7.5rem] bg-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CharacterListSkeleton;
