interface Props {
  size?: number;
}

export default function FootballIcon({ size = 48 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-label="Football with Olympic rings"
    >
      {/* Ball */}
      <circle cx="50" cy="44" r="30" fill="#f5f5f5" stroke="#1a1a2e" strokeWidth="2.5" />
      {/* Pentagon patches */}
      <polygon points="50,22 58,28 55,38 45,38 42,28" fill="#1a1a2e" stroke="#1a1a2e" strokeWidth="0.8" />
      <polygon points="68,35 74,43 71,53 61,52 60,42" fill="#1a1a2e" stroke="#1a1a2e" strokeWidth="0.8" />
      <polygon points="63,60 56,66 47,63 46,53 55,48" fill="#1a1a2e" stroke="#1a1a2e" strokeWidth="0.8" />
      <polygon points="37,61 30,55 32,45 41,42 48,49" fill="#1a1a2e" stroke="#1a1a2e" strokeWidth="0.8" />
      <polygon points="32,38 34,28 43,27 47,37 40,43" fill="#1a1a2e" stroke="#1a1a2e" strokeWidth="0.8" />
      {/* Olympic rings — centered, well within viewBox */}
      <circle cx="28" cy="83" r="7" fill="none" stroke="#0085C7" strokeWidth="2.5" />
      <circle cx="39" cy="83" r="7" fill="none" stroke="#F4C300" strokeWidth="2.5" />
      <circle cx="50" cy="83" r="7" fill="none" stroke="#009F3D" strokeWidth="2.5" />
      <circle cx="61" cy="83" r="7" fill="none" stroke="#DF0024" strokeWidth="2.5" />
      <circle cx="72" cy="83" r="7" fill="none" stroke="#000" strokeWidth="2.5" />
    </svg>
  );
}
