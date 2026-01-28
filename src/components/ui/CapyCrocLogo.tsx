// Capybara riding a Crocodile - Tongue-in-cheek logo
export default function CapyCrocLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Jungle river background */}
      <circle cx="50" cy="50" r="48" fill="#e8f5e9" />

      {/* River water */}
      <path
        d="M 10 60 Q 30 55, 50 60 T 90 60 L 90 90 L 10 90 Z"
        fill="#81c784"
        opacity="0.5"
      />

      {/* Crocodile body */}
      <ellipse cx="50" cy="65" rx="30" ry="8" fill="#558b2f" />

      {/* Crocodile head */}
      <ellipse cx="70" cy="63" rx="12" ry="6" fill="#558b2f" />

      {/* Crocodile snout */}
      <ellipse cx="80" cy="63" rx="6" ry="3" fill="#689f38" />

      {/* Crocodile eye */}
      <circle cx="75" cy="61" r="2" fill="#ffeb3b" />
      <circle cx="75" cy="61" r="1" fill="#000" />

      {/* Crocodile tail */}
      <path
        d="M 20 65 Q 15 63, 10 60 Q 8 62, 12 64 Q 16 66, 20 65 Z"
        fill="#558b2f"
      />

      {/* Crocodile teeth (little triangles) */}
      <path d="M 78 65 L 79 66 L 80 65 Z" fill="#fff" />
      <path d="M 81 65 L 82 66 L 83 65 Z" fill="#fff" />

      {/* Capybara body (sitting on croc) */}
      <ellipse cx="45" cy="55" rx="10" ry="8" fill="#8d6e63" />

      {/* Capybara head */}
      <circle cx="48" cy="48" r="6" fill="#8d6e63" />

      {/* Capybara ears */}
      <ellipse cx="45" cy="44" rx="2" ry="3" fill="#6d4c41" />
      <ellipse cx="51" cy="44" rx="2" ry="3" fill="#6d4c41" />

      {/* Capybara eyes */}
      <circle cx="46" cy="48" r="1.5" fill="#000" />
      <circle cx="50" cy="48" r="1.5" fill="#000" />

      {/* Capybara nose */}
      <ellipse cx="48" cy="50" rx="1.5" ry="1" fill="#5d4037" />

      {/* Capybara arms holding on */}
      <ellipse cx="42" cy="58" rx="3" ry="2" fill="#8d6e63" />
      <ellipse cx="54" cy="58" rx="3" ry="2" fill="#8d6e63" />

      {/* Jungle leaves decoration */}
      <path
        d="M 15 20 Q 12 25, 15 30 Q 18 25, 15 20 Z"
        fill="#66bb6a"
        opacity="0.6"
      />
      <path
        d="M 85 15 Q 82 20, 85 25 Q 88 20, 85 15 Z"
        fill="#66bb6a"
        opacity="0.6"
      />

      {/* Water ripples */}
      <ellipse cx="25" cy="72" rx="8" ry="2" fill="#66bb6a" opacity="0.3" />
      <ellipse cx="70" cy="75" rx="10" ry="2" fill="#66bb6a" opacity="0.3" />
    </svg>
  )
}
