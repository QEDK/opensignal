/// <reference types="react-scripts" />

interface Project {
  id: string;
  name: string;
  description?: string;
  link?: string;
  avatar?: string;
  selfStake: number;
  signal: number;
  project_id?: string;
  deployment: string;
  twitter: string;
  creator: string;
  tags: string[];
}
