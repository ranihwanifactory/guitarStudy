export interface Barre {
  fret: number;
  startString: number; // 1-6 (High E is 1, Low E is 6)
  endString: number;
}

export interface ChordData {
  chordName: string;
  // Array representing strings 6 (Low E) down to 1 (High E)
  // Value: -1 (mute), 0 (open), >0 (fret number)
  frets: number[];
  // Array representing finger used for each string
  // 0 (none/open), 1 (index), 2 (middle), 3 (ring), 4 (pinky), 5 (thumb)
  fingers: number[];
  startingFret: number; // The fret number of the top visible fret in the diagram
  barre: Barre | null;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  data: ChordData | null;
}