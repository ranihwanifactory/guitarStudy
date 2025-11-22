import React from 'react';
import { ChordData } from '../types';

interface FretboardProps {
  data: ChordData;
}

const Fretboard: React.FC<FretboardProps> = ({ data }) => {
  const { frets, fingers, startingFret, barre } = data;

  // SVG Dimensions
  const width = 220;
  const height = 280;
  const marginX = 35;
  const marginY = 40;
  const stringSpacing = 30;
  const fretSpacing = 45;

  // Calculate grid
  const numStrings = 6;
  const numFrets = 5; // Show 5 frets window

  // Helper to get X coordinate for a string (0-indexed from left/low E)
  const getStringX = (stringIndex: number) => marginX + stringIndex * stringSpacing;
  
  // Helper to get Y coordinate for a fret (1-indexed relative to view)
  const getFretY = (fretIndex: number) => marginY + (fretIndex - 1) * fretSpacing;

  return (
    <div className="relative bg-white rounded-lg shadow-2xl p-4 max-w-[300px] mx-auto transform transition-transform hover:scale-105">
      <h3 className="text-center text-2xl font-bold text-slate-800 mb-2 font-serif">{data.chordName}</h3>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="stringGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#888" />
            <stop offset="50%" stopColor="#ddd" />
            <stop offset="100%" stopColor="#888" />
          </linearGradient>
        </defs>

        {/* Fretboard Background */}
        <rect x={marginX - 5} y={marginY} width={width - 2 * marginX + 10} height={numFrets * fretSpacing} fill="#fbf7f3" rx="4" />

        {/* Frets (Horizontal Lines) */}
        {Array.from({ length: numFrets + 1 }).map((_, i) => (
          <line
            key={`fret-line-${i}`}
            x1={marginX}
            y1={marginY + i * fretSpacing}
            x2={width - marginX}
            y2={marginY + i * fretSpacing}
            stroke={i === 0 && startingFret === 1 ? "#333" : "#aaa"}
            strokeWidth={i === 0 && startingFret === 1 ? 6 : 2}
            strokeLinecap="round"
          />
        ))}

        {/* Strings (Vertical Lines) */}
        {Array.from({ length: numStrings }).map((_, i) => (
          <line
            key={`string-line-${i}`}
            x1={getStringX(i)}
            y1={marginY}
            x2={getStringX(i)}
            y2={marginY + numFrets * fretSpacing}
            stroke="#555"
            // Thicker for lower strings (index 0, 1, 2)
            strokeWidth={3 - i * 0.3} 
          />
        ))}

        {/* Starting Fret Number */}
        {startingFret > 1 && (
          <text x={10} y={marginY + fretSpacing / 2 + 5} className="text-sm font-bold fill-slate-600">
            {startingFret}fr
          </text>
        )}

        {/* Barre Chord Indicator */}
        {barre && (
          <g>
            <rect
              x={getStringX(6 - barre.startString)} // startString 6 is low E (index 0)
              y={getFretY(barre.fret - startingFret + 1) - 12} // Offset relative to fret space
              width={getStringX(6 - barre.endString) - getStringX(6 - barre.startString)}
              height={24}
              rx={12}
              fill="#c47f53"
              opacity={0.9}
            />
          </g>
        )}

        {/* Finger Positions and Open/Mute Indicators */}
        {frets.map((fretVal, i) => {
          // i goes 0 (Low E) to 5 (High E)
          const stringX = getStringX(i);
          
          // Indicators above nut
          if (fretVal === -1) {
            return (
              <text key={`mute-${i}`} x={stringX} y={marginY - 10} textAnchor="middle" className="text-sm font-bold fill-red-500">
                X
              </text>
            );
          }
          if (fretVal === 0) {
            return (
              <circle key={`open-${i}`} cx={stringX} cy={marginY - 15} r={5} stroke="#333" strokeWidth={2} fill="none" />
            );
          }

          // Render Finger Dot
          // Calculate relative fret position based on startingFret
          const relativeFret = fretVal - startingFret + 1;
          
          // Only render if visible in the 5-fret window
          if (relativeFret >= 1 && relativeFret <= 5) {
             const fretY = getFretY(relativeFret) - (fretSpacing / 2);
             const fingerNum = fingers[i];

             return (
               <g key={`finger-${i}`}>
                 <circle
                   cx={stringX}
                   cy={fretY}
                   r={11}
                   fill="#222"
                   stroke="#fff"
                   strokeWidth={2}
                 />
                 {fingerNum > 0 && (
                   <text
                     x={stringX}
                     y={fretY + 4}
                     textAnchor="middle"
                     fill="#fff"
                     fontSize="12"
                     fontWeight="bold"
                   >
                     {fingerNum === 5 ? 'T' : fingerNum}
                   </text>
                 )}
               </g>
             );
          }
          return null;
        })}
      </svg>
      
      <div className="mt-2 text-center text-xs text-slate-500 border-t pt-2">
        <div className="flex justify-center space-x-4">
          <span>1: 검지</span>
          <span>2: 중지</span>
          <span>3: 약지</span>
          <span>4: 소지</span>
        </div>
      </div>
    </div>
  );
};

export default Fretboard;