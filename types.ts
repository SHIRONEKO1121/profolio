
export interface ProjectCard {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export interface Skill {
  name: string;
  icon: string;
  color: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  status: 'past' | 'present' | 'future';
}
