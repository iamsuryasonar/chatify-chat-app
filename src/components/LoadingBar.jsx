const LoadingBar = () => {
    return (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gray-200 overflow-hidden">
            <div
                className="w-[30%] loading-bar absolute h-full bg-blue-500"
            ></div>
        </div>
    );
};

export default LoadingBar;