import { Wrapper } from "./LoadingFullScreen.Styled";
import DogLoading from "@assets/gif/dog.gif";
const LoadingFullScreen: React.FC = () => {
  return (
    <Wrapper className="loading-full-screen">
      <img src={DogLoading}></img>
    </Wrapper>
  );
};

export default LoadingFullScreen;
