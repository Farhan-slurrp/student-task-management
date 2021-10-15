import CircularProgress from "@material-ui/core/CircularProgress";

export interface LoadingProps {}

const Loading: React.FunctionComponent<LoadingProps> = () => {
  return (
    <div className="grid w-screen h-screen place-items-center">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress />
        <p className="text-xl md:text-2xl">Loading</p>
      </div>
    </div>
  );
};

export default Loading;
