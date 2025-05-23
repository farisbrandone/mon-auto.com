import { SVGProps } from "react";

export function DoubleBack(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 48 48"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M42.5 7.857L26.357 24L42.5 40.143M21.643 7.857L5.5 24l16.143 16.143"
      />
    </svg>
  );
}
