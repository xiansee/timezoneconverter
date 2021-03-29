import React from 'react';
import diagmondsLight from "../assets/images/diagmondsLight.png"

function Backdrop() {
  const stroke = "white",
        strokeWidth = "0",
        fillGradient = "url(#colorGradient)",
        fillImage = "url(#backdropImage)",
        colorStart = "rgba(55, 187, 242)",
        colorEnd = "rgba(25, 157, 212)";

  return (
    <svg className="backdrop" width="100%" viewBox="0 0 1920 1080">

      <linearGradient id="colorGradient">
        <stop offset="0%" stopColor={colorStart} />
        <stop offset="50%" stopColor={colorEnd} />
      </linearGradient>

      <path
        d="M 0 0 V 450 C 800 500 900 900 1920 700 V 0 H 0"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="white"
      >
      </path>

      <path
        d="M 0 0 V 400 C 800 500 900 900 1920 600 V 0 H 0"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fillGradient}
      >
      </path>

      <pattern id="backdropImage" patternUnits="userSpaceOnUse" width="141" height="142">
        <image href={diagmondsLight} x="0" y="0" width="141" height="142" />
      </pattern>

      <path
        d="M 0 0 V 400 C 800 500 900 900 1920 600 V 0 H 0"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fillImage}
      >
      </path>

    </svg>
  )
}

export default Backdrop;
