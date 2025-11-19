export interface ImageState {
  original: string | null; // Base64 data URI
  generated: string | null; // Base64 data URI
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GenerationError {
  message: string;
  details?: string;
}

export const SAMPLE_PROMPTS = [
  "Convert this into a vibrant anime style",
  "Make it look like a cyberpunk city",
  "Apply a vintage 1980s polaroid filter",
  "Turn this into a watercolor painting",
  "Make the background black and white",
  "Add fireworks in the sky"
];