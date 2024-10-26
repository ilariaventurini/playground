export interface LoaderProps {
  width?: number | string
  height?: number | string
}

export const Loader = ({ width, height }: LoaderProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 39 39"
      width={width}
      height={height}
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <path
        fill="none"
        stroke="#00B4FF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M37 19.5C37 9.8 29.2 2 19.5 2"
      />
    </svg>
  )
}
