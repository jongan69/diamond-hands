import styled from 'styled-components';

export const Container = styled.div`
  align-items: center;
  display: grid;
  grid-template-rows: 3fr 1fr 1fr;
  justify-content: center;
  text-align: center;
  width: 100%;
`;

export const Picture = styled.div`
  background-image: url(${({ background }) => background});
  background-size: cover;
  border-radius: 50%;
  height: 130px;
  margin: 0 auto;
  width: 130px;
`;

export const Title = styled.h1`
  font-size: 1.5em;
  font-family: tahoma;
  text-align: center;
  animation: glow 2s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(255,255,255,0.4),
               0 0 20px rgba(255,255,255,0.2);

  @keyframes glow {
    0%, 100% {
      text-shadow: 0 0 10px rgba(255,255,255,0.4),
                   0 0 20px rgba(255,255,255,0.2);
    }
    50% {
      text-shadow: 0 0 20px rgba(255,255,255,0.6),
                   0 0 30px rgba(255,255,255,0.4);
    }
  }
`;

export const Subtitle = styled.p`
  padding-top: 20px;
  font-size: 1em;
  font-family: tahoma;
  text-shadow: 1px 1px 2px white, 0 0 1em white, 0 0 0.1em white;
  text-align: center;
`
