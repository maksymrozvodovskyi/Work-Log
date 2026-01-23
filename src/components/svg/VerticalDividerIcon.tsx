import React from "react";

type VerticalDividerIconPropsType = {
  className?: string;
  style?: React.CSSProperties;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
  strokeDasharray?: string;
};

const VerticalDividerIcon = ({
  className,
  style,
  height = 770,
  stroke = "#494C55",
  strokeWidth = "1",
  strokeDasharray = "1 4",
}: VerticalDividerIconPropsType) => {
  const generatePath = () => {
    const h = typeof height === "string" ? parseInt(height, 10) : height;
    const segments: string[] = [];
    for (let y = h - 4.5; y >= 0.5; y -= 5) {
      segments.push(`M0 ${y}H0.5V${y + 4}H0V${y}Z`);
    }
    return segments.join("");
  };

  return (
    <svg
      width="1"
      height={height}
      viewBox={`0 0 1 ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d={generatePath()}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        fill="none"
      />
    </svg>
  );
};

export default VerticalDividerIcon;

