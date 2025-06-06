"use client"

import { useTheme } from "./theme-provider"

export default function BlockchainMarquee() {
  return <MarqueeContent />
}

function MarqueeContent() {
  const { isDark } = useTheme()

  const blockchains = [
    { 
      name: "Ethereum", 
      logo: <EthereumLogo isDark={isDark} />, 
      fontStyle: "font-[Roboto] font-medium", // Ethereum.org uses Roboto
      hoverColor: "#627EEA" 
    },
    { 
      name: "Arbitrum", 
      logo: <ArbitrumLogo isDark={isDark} />, 
      fontStyle: "font-[Inter] font-bold", // Arbitrum uses Inter
      hoverColor: "#28A0F0" 
    },
    { 
      name: "Avalanche", 
      logo: <AvalancheLogo isDark={isDark} />, 
      fontStyle: "font-[Poppins] font-bold", // Avalanche uses Poppins
      hoverColor: "#E84142" 
    },
    { 
      name: "BNB Chain", 
      logo: <BNBLogo isDark={isDark} />, 
      fontStyle: "font-[Poppins] font-semibold", // BNB Chain uses Poppins
      hoverColor: "#F3BA2F" 
    },
    { 
      name: "Polygon", 
      logo: <PolygonLogo isDark={isDark} />, 
      fontStyle: "font-[Inter] font-bold", // Polygon uses Inter
      hoverColor: "#8247E5" 
    },
    { 
      name: "Optimism", 
      logo: <OptimismLogo isDark={isDark} />, 
      fontStyle: "font-[Inter] font-bold", // Optimism uses Inter
      hoverColor: "#FF0420" 
    },
    { 
      name: "Base", 
      logo: <BaseLogo isDark={isDark} />, 
      fontStyle: "font-[Inter] font-bold", // Base uses Inter
      hoverColor: "#0052FF" 
    },
    { 
      name: "Fantom", 
      logo: <FantomLogo isDark={isDark} />, 
      fontStyle: "font-[Inter] font-bold", // Fantom uses Inter
      hoverColor: "#1969FF" 
    },
  ]

  return (
    <section className={`py-16 overflow-hidden transition-colors ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...blockchains, ...blockchains, ...blockchains].map((blockchain, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-4 mx-8 flex-shrink-0 group transition-colors duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center transition-colors duration-300 group-hover:[&>svg>*]:fill-[var(--hoverColor)]" style={{ "--hoverColor": blockchain.hoverColor } as React.CSSProperties}>
                {blockchain.logo}
              </div>
              <span 
                className={`text-xl transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"} ${blockchain.fontStyle} group-hover:text-[var(--hoverColor)]`}
                style={{ "--hoverColor": blockchain.hoverColor } as React.CSSProperties}
              >
                {blockchain.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Grayscale Ethereum Logo (hover for #627EEA)
function EthereumLogo({ isDark }: { isDark: boolean }) {
  return (
    <svg width="48" height="48" viewBox="0 0 784 1277" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M392.07 0L383.5 29.11V873.74L392.07 882.29L784.13 650.54L392.07 0Z"
        className="transition-colors duration-300"
        fill={isDark ? "#A0A0A0" : "#505050"}
      />
      <path
        d="M392.07 0L0 650.54L392.07 882.29V472.33V0Z"
        className="transition-colors duration-300"
        fill={isDark ? "#C0C0C0" : "#707070"}
      />
      <path
        d="M392.07 956.52L387.24 962.41V1263.28L392.07 1277.38L784.37 724.89L392.07 956.52Z"
        className="transition-colors duration-300"
        fill={isDark ? "#808080" : "#606060"}
      />
      <path
        d="M392.07 1277.38V956.52L0 724.89L392.07 1277.38Z"
        className="transition-colors duration-300"
        fill={isDark ? "#C0C0C0" : "#707070"}
      />
      <path
        d="M392.07 882.29L784.13 650.54L392.07 472.33V882.29Z"
        className="transition-colors duration-300"
        fill={isDark ? "#606060" : "#404040"}
      />
      <path
        d="M0 650.54L392.07 882.29V472.33L0 650.54Z"
        className="transition-colors duration-300"
        fill={isDark ? "#909090" : "#505050"}
      />
    </svg>
  )
}

// Grayscale Arbitrum Logo (hover for #28A0F0)
function ArbitrumLogo({ isDark }: { isDark: boolean }) {
  return (
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="28" cy="28" r="28" 
        className="transition-colors duration-300"
        fill={isDark ? "#505050" : "#A0A0A0"}
      />
      <path
        d="M28 10L18 30H24L28 22L32 30H38L28 10Z"
        className="transition-colors duration-300"
        fill={isDark ? "#E0E0E0" : "#FFFFFF"}
      />
      <path
        d="M22 34L26 26L30 34H38L32 46H24L22 34Z"
        className="transition-colors duration-300"
        fill={isDark ? "#E0E0E0" : "#FFFFFF"}
      />
      <circle 
        cx="28" cy="28" r="2" 
        className="transition-colors duration-300"
        fill={isDark ? "#505050" : "#A0A0A0"}
      />
    </svg>
  )
}

// Grayscale Avalanche Logo (hover for #E84142)
function AvalancheLogo({ isDark }: { isDark: boolean }) {
  return (
    <svg width="48" height="48" viewBox="0 0 1503 1504" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect 
        x="287" y="258" width="928" height="844" 
        className="transition-colors duration-300"
        fill={isDark ? "#808080" : "#606060"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1040.92 881.51C1057.78 881.51 1068.3 866.87 1060.96 851.88L787.478 274.845C779.948 259.306 752.426 259.306 744.896 274.845L471.413 851.88C464.073 866.87 474.591 881.51 491.451 881.51H1040.92Z"
        className="transition-colors duration-300"
        fill={isDark ? "#FFFFFF" : "#F0F0F0"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1503 752C1503 1168.47 1168.47 1503 752 1503C335.529 1503 1 1168.47 1 752C1 335.529 335.529 1 752 1C1168.47 1 1503 335.529 1503 752ZM721.664 1314.79C726.134 1323.05 735.866 1328.52 746.5 1328.52C757.134 1328.52 766.866 1323.05 771.336 1314.79L1040.92 881.51C1057.78 881.51 1068.3 866.87 1060.96 851.88L787.478 274.845C779.948 259.306 752.426 259.306 744.896 274.845L471.413 851.88C464.073 866.87 474.591 881.51 491.451 881.51H721.664V1314.79Z"
        className="transition-colors duration-300"
        fill={isDark ? "#808080" : "#606060"}
      />
    </svg>
  )
}

// Grayscale BNB Chain Logo (hover for #F3BA2F)
function BNBLogo({ isDark }: { isDark: boolean }) {
  return (
    <svg width="48" height="48" viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)">
        <path
          d="M611.116 1000L386.19 774.983L482.595 678.648L611.116 807.275L739.637 678.648L836.042 774.983L611.116 1000Z"
          className="transition-colors duration-300"
          fill={isDark ? "#C0C0C0" : "#808080"}
        />
        <path
          d="M1000 611.116L1225.02 386.19L1321.35 482.595L1192.72 611.116L1321.35 739.637L1225.02 836.042L1000 611.116Z"
          className="transition-colors duration-300"
          fill={isDark ? "#C0C0C0" : "#808080"}
        />
        <path
          d="M1388.88 1000L1613.81 1225.02L1517.4 1321.35L1388.88 1192.72L1260.36 1321.35L1163.96 1225.02L1388.88 1000Z"
          className="transition-colors duration-300"
          fill={isDark ? "#C0C0C0" : "#808080"}
        />
        <path
          d="M1000 1388.88L774.983 1613.81L678.648 1517.4L807.275 1388.88L678.648 1260.36L774.983 1163.96L1000 1388.88Z"
          className="transition-colors duration-300"
          fill={isDark ? "#C0C0C0" : "#808080"}
        />
        <path
          d="M1000 836.042L1225.02 611.116L1388.88 774.983L1163.96 1000L1388.88 1225.02L1225.02 1388.88L1000 1163.96L774.983 1388.88L611.116 1225.02L836.042 1000L611.116 774.983L774.983 611.116L1000 836.042Z"
          className="transition-colors duration-300"
          fill={isDark ? "#C0C0C0" : "#808080"}
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="2000" height="2000" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

// Grayscale Polygon Logo (hover for #8247E5)
function PolygonLogo({ isDark }: { isDark: boolean }) {
  return (
    <svg width="48" height="48" viewBox="0 0 38.4 33.5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M29 10.2c-.7-.4-1.6-.4-2.4 0L21 13.5l-3.8 2.1-5.5 3.3c-.7.4-1.6.4-2.4 0L5 16.3c-.7-.4-1.2-1.2-1.2-2.1v-5c0-.8.4-1.6 1.2-2.1l4.3-2.5c.7-.4 1.6-.4 2.4 0L16 7.2c.7.4 1.2 1.2 1.2 2.1v3.3l3.8-2.2V7c0-.8-.4-1.6-1.2-2.1l-8-4.7c-.7-.4-1.6-.4-2.4 0L1.2 5C.4 5.4 0 6.2 0 7v9.4c0 .8.4 1.6 1.2 2.1l8.1 4.7c.7.4 1.6.4 2.4 0l5.5-3.2 3.8-2.2 5.5-3.2c.7-.4 1.6-.4 2.4 0l4.3 2.5c.7.4 1.2 1.2 1.2 2.1v5c0 .8-.4 1.6-1.2 2.1L29 28.8c-.7.4-1.6.4-2.4 0l-4.3-2.5c-.7-.4-1.2-1.2-1.2-2.1V21l-3.8 2.2v3.3c0 .8.4 1.6 1.2 2.1l8.1 4.7c.7.4 1.6.4 2.4 0l8.1-4.7c.7-.4 1.2-1.2 1.2-2.1V17c0-.8-.4-1.6-1.2-2.1L29 10.2z"
        className="transition-colors duration-300"
        fill={isDark ? "#909090" : "#707070"}
      />
    </svg>
  )
}

// Grayscale Optimism Logo (hover for #FF0420)
function OptimismLogo({ isDark }: { isDark: boolean }) {
  return (
    <svg width="48" height="48" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="250" cy="250" r="250" 
        className="transition-colors duration-300"
        fill={isDark ? "#808080" : "#606060"}
      />
      <path
        d="M174.34 329.23c-15.9 0-30.5-2.29-43.8-6.87-13.3-4.58-24.64-11.16-34.01-19.74-9.37-8.58-16.54-18.89-21.5-30.93-4.96-12.04-7.44-25.37-7.44-39.99 0-5.04.42-10.25 1.26-15.63.84-5.38 2.02-10.84 3.54-16.38 7.44-27.12 21.92-47.82 43.44-62.1C137.37 122.86 163.66 115.72 194.5 115.72c15.9 0 30.5 2.29 43.8 6.87 13.3 4.58 24.64 11.16 34.01 19.74 9.37 8.58 16.54 18.89 21.5 30.93 4.96 12.04 7.44 25.37 7.44 39.99 0 5.04-.42 10.25-1.26 15.63-.84 5.38-2.02 10.84-3.54 16.38-7.44 27.12-21.92 47.82-43.44 62.1-21.52 14.28-47.81 21.42-78.67 21.42z"
        className="transition-colors duration-300"
        fill={isDark ? "#E0E0E0" : "#F0F0F0"}
      />
      <path
        d="M301.59 329.23c-15.9 0-30.5-2.29-43.8-6.87-13.3-4.58-24.64-11.16-34.01-19.74-9.37-8.58-16.54-18.89-21.5-30.93-4.96-12.04-7.44-25.37-7.44-39.99 0-5.04.42-10.25 1.26-15.63.84-5.38 2.02-10.84 3.54-16.38 7.44-27.12 21.92-47.82 43.44-62.1 21.52-14.28 47.81-21.42 78.67-21.42 15.9 0 30.5 2.29 43.8 6.87 13.3 4.58 24.64 11.16 34.01 19.74 9.37 8.58 16.54 18.89 21.5 30.93 4.96 12.04 7.44 25.37 7.44 39.99 0 5.04-.42 10.25-1.26 15.63-.84 5.38-2.02 10.84-3.54 16.38-7.44 27.12-21.92 47.82-43.44 62.1-21.52 14.28-47.81 21.42-78.67 21.42z"
        className="transition-colors duration-300"
        fill={isDark ? "#E0E0E0" : "#F0F0F0"}
      />
    </svg>
  )
}

// Grayscale Base Logo (hover for #0052FF)
function BaseLogo({ isDark }: { isDark: boolean }) {
  return (
    <svg width="48" height="48" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 21.3687 0.239258 48.8335H72.8525V61.2005H0.239258C2.35281 88.6653 26.0432 110.034 54.921 110.034Z"
        className="transition-colors duration-300"
        fill={isDark ? "#808080" : "#606060"}
      />
    </svg>
  )
}

// Grayscale Fantom Logo (hover for #1969FF)
function FantomLogo({ isDark }: { isDark: boolean }) {
  return (
    <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 0L30 8L16 16L2 8L16 0Z"
        className="transition-colors duration-300"
        fill={isDark ? "#A0A0A0" : "#707070"}
      />
      <path
        d="M2 8L16 16L30 8L16 32L2 24V8Z"
        className="transition-colors duration-300"
        fill={isDark ? "#A0A0A0" : "#707070"}
        opacity="0.8"
      />
      <path
        d="M16 16L30 8V20L16 28L2 20V8L16 16Z"
        className="transition-colors duration-300"
        fill={isDark ? "#A0A0A0" : "#707070"}
        opacity="0.6"
      />
    </svg>
  )
}