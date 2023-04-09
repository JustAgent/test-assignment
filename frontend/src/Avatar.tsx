import styled from "@emotion/styled";

const StyledAvatar = () => {
  const StyledDiv = styled("div")({
    borderRadius: "50px",
    overflow: "hidden",
    padding: "0px",
    margin: "0px",
    width: "40px",
    height: "40px",
    display: "inline-block",
    background: "rgb(250, 171, 0)",
  });
  return (
    <div>
      <span>
        <StyledDiv>
          <svg x="0" y="0" width="40" height="40">
            <rect
              x="0"
              y="0"
              width="40"
              height="40"
              transform="translate(6.87854190678896 2.716947951293788) rotate(191.6 20 20)"
              fill="#F1F500"
            ></rect>
            <rect
              x="0"
              y="0"
              width="40"
              height="40"
              transform="translate(14.462688050238675 -4.596997868356552) rotate(426.5 20 20)"
              fill="#C81426"
            ></rect>
            <rect
              x="0"
              y="0"
              width="40"
              height="40"
              transform="translate(-27.730682658274382 17.546288467585168) rotate(194.7 20 20)"
              fill="#F2D202"
            ></rect>
          </svg>
        </StyledDiv>
      </span>
    </div>
  );
};

export default StyledAvatar;
