import React from 'react';

interface TrendUpProps {
  size?: number;
  color?: string;
  className?: string;
}

const TrendUp: React.FC<TrendUpProps> = ({
  size = 32,
  color = '#000000',
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 256 256"
    className={className}
  >
    <path d="M244,56v64a12,12,0,0,1-24,0V85l-75.51,75.52a12,12,0,0,1-17,0L96,129,32.49,192.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0L136,135l67-67H168a12,12,0,0,1,0-24h64A12,12,0,0,1,244,56Z" />
  </svg>
);

export default TrendUp;
