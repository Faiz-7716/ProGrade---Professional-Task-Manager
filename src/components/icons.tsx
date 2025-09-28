export const Icons = {
  logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 1.5 L12 10.5 M7.5 6 L16.5 6" 
        stroke="hsl(var(--accent))" 
        strokeWidth="2.5" 
        transform="translate(0, 2) rotate(45 12 6)"
      />
      <path d="M7 7h10v10H7z" strokeWidth="2.5" />
      <path d="M7 12h3" strokeWidth="2.5" />
    </svg>
  ),
};
