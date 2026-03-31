interface Props {
  size?: number;
}

export default function FootballIcon({ size = 48 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      width={size}
      height={size}
      aria-label="Football with Olympic rings"
    >
      {/* Ball */}
      <circle cx="40" cy="36" r="24" fill="#f5f5f5" stroke="#222" strokeWidth="2" />
      {/* Pentagon patches */}
      <polygon points="40,18 47,23 45,32 35,32 33,23" fill="#1a1a2e" stroke="#222" strokeWidth="1" />
      <polygon points="57,29 62,36 59,44 50,43 49,34" fill="#1a1a2e" stroke="#222" strokeWidth="1" />
      <polygon points="52,51 45,57 37,54 36,45 44,41" fill="#1a1a2e" stroke="#222" strokeWidth="1" />
      <polygon points="29,52 22,47 24,38 32,35 38,41" fill="#1a1a2e" stroke="#222" strokeWidth="1" />
      <polygon points="24,31 26,23 34,22 37,31 31,36" fill="#1a1a2e" stroke="#222" strokeWidth="1" />
      {/* Olympic rings */}
      <circle cx="19" cy="70" r="5" fill="none" stroke="#0085C7" strokeWidth="2.2" />
      <circle cx="30" cy="70" r="5" fill="none" stroke="#F4C300" strokeWidth="2.2" />
      <circle cx="41" cy="70" r="5" fill="none" stroke="#009F3D" strokeWidth="2.2" />
      <circle cx="52" cy="70" r="5" fill="none" stroke="#DF0024" strokeWidth="2.2" />
      <circle cx="63" cy="70" r="5" fill="none" stroke="#000000" strokeWidth="2.2" />
    </svg>
  );
}
