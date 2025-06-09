import styled from 'styled-components';

export const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader btn">
        <div className="circle">
          <div className="dot" />
          <div className="outline" />
        </div>
        <div className="circle">
          <div className="dot" />
          <div className="outline" />
        </div>
        <div className="circle">
          <div className="dot" />
          <div className="outline" />
        </div>
        <div className="circle">
          <div className="dot" />
          <div className="outline" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .btn {
    border: none;
    width: 9em;
    height: 3em;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    background: #1c1a1c;
    cursor: pointer;
    transition: all 150ms;
  }

  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    --color: hsl(0, 0%, 87%);
    --animation-duration: 3s;
    --animation-timing: cubic-bezier(0.4, 0, 0.2, 1);
    --animation-iteration: infinite;
  }

  .loader .circle {
    position: relative;
    width: 5px;
    height: 5px;
    border: 2px solid var(--color);
    border-radius: 50%;
    margin: 0 3px;
    background-color: transparent;
    animation-name: circle-keys;
    animation-duration: var(--animation-duration);
    animation-timing-function: var(--animation-timing);
    animation-iteration-count: var(--animation-iteration);
    animation-fill-mode: forwards;
  }

  .loader .circle .dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--color);
    transform: translate(-50%, -50%);
    animation-name: dot-keys;
    animation-duration: var(--animation-duration);
    animation-timing-function: var(--animation-timing);
    animation-iteration-count: var(--animation-iteration);
    animation-fill-mode: forwards;
  }

  .loader .circle .outline {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation-name: outline-keys;
    animation-duration: var(--animation-duration);
    animation-timing-function: var(--animation-timing);
    animation-iteration-count: var(--animation-iteration);
    animation-fill-mode: forwards;
  }

  /* Stagger the animation start times for ripple effect */
  .circle:nth-child(1) {
    animation-delay: 0s;
  }
  .circle:nth-child(2) {
    animation-delay: 0.3s;
  }
  .circle:nth-child(3) {
    animation-delay: 0.6s;
  }
  .circle:nth-child(4) {
    animation-delay: 0.9s;
  }

  .circle:nth-child(1) .dot {
    animation-delay: 0s;
  }
  .circle:nth-child(2) .dot {
    animation-delay: 0.3s;
  }
  .circle:nth-child(3) .dot {
    animation-delay: 0.6s;
  }
  .circle:nth-child(4) .dot {
    animation-delay: 0.9s;
  }

  .circle:nth-child(1) .outline {
    animation-delay: 0s;
  }
  .circle:nth-child(2) .outline {
    animation-delay: 0.3s;
  }
  .circle:nth-child(3) .outline {
    animation-delay: 0.6s;
  }
  .circle:nth-child(4) .outline {
    animation-delay: 0.9s;
  }

  @keyframes circle-keys {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes dot-keys {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  @keyframes outline-keys {
    0% {
      transform: translate(-50%, -50%) scale(0);
      outline: solid 20px var(--color);
      outline-offset: 0;
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      outline: solid 0 transparent;
      outline-offset: 20px;
      opacity: 0;
    }
  }
`;

export default Loader;
