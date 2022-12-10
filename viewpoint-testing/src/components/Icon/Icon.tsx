import styled from "styled-components";

export const Wrapper = styled.div`
  &&& {
    width: 22px;
    height: 22px;
    text-align: center;
    cursor: pointer;
    p {
      font-size: var(--font-size-span);
      color: white !important;
    }
    .product-icon {
      background-color: #1890ff;
      border-radius: 5px;
    }
    .viewpoint-icon {
      background-color: green;
      border-radius: 5px;
    }
  }
`;
export type IconProps = {
  isProductIcon?: boolean;
};
const Icon: React.FC<IconProps> = ({ isProductIcon = true }) => {
  return (
    <Wrapper>
      {isProductIcon ? (
        <p className="product-icon">P</p>
      ) : (
        <p className="viewpoint-icon">V</p>
      )}
    </Wrapper>
  );
};

export default Icon;
