
import React from 'react';
import { ProjectCard, Skill, TimelineEvent } from './types';

export const SITE_ASSETS = {
  mascot: 'https://pngimg.com/d/cat_PNG50480.png',
  avatar: '/icon/cat.jpg',
  chatBackground: '#', // Set a custom background image URL for the AI Chat panel
  entranceBackgrounds: [
    'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513245533132-aa7f8e72620c?q=80&w=1600&auto=format&fit=crop'
  ],
  logo: 'https://api.dicebear.com/7.x/bottts/svg?seed=shironeko&backgroundColor=b6e3f4'
};

export const SITES: ProjectCard[] = [
  {
    title: 'Writings',
    description: 'Daily thoughts',
    icon: '/icon/135.ico',
    link: 'https://archive.shironeko.site/'
  },
  {
    title: 'Gallery',
    description: 'Memories',
    icon: '/icon/120.ico',
    link: '#'
  },
  {
    title: 'Music',
    description: 'Musics I love (building)',
    icon: '/icon/112.ico',
    link: '#'
  },
  {
    title: 'DSE database (building)',
    description: 'For my students',
    icon: '/icon/113.ico',
    link: '#' 
  }
];

export const PROJECTS: ProjectCard[] = [
  {
    title: 'SHIRONEKO homepage',
    description: 'This exact website source code.',
    icon: '/icon/125.ico',
    link: 'https://github.com/SHIRONEKO1121/profolio'
  },
  {
    title: 'Trip planner',
    description: 'developing...',
    icon: '/icon/air.png',
    link: '#'
  },
  {
    title: 'Vibe player',
    description: 'developing...',
    icon: '/icon/forest.png',
    link: '#'
  }
];

export const GALLERY_IMAGES = [
  { url: '/gallery/nc.jpg', title: 'My lovely cat named Milk Tea' },
  { url: '/gallery/japan.jpg', title: 'Grad trip to Japan' },
  { url: '/gallery/cq.jpg', title: 'The last day of 2023, @Chong Qing' },
  { url: '/gallery/2024.jpg', title: 'Sunset of year 2024, @Phu Quoc Island' },
  { url: '/gallery/rose.jpg', title: 'With my love' },
  { url: '/gallery/2025.jpg', title: 'The last day of 2025, @Yibin' },
];

export const SKILLS: Skill[] = [
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: '#3776AB' },
  { name: 'Scikit-learn', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg', color: '#F7931E' },
  { name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg', color: '#EE4C2C' },
  { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', color: '#181717' },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', color: '#007396' },
  { name: 'VSCode', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', color: '#007ACC' },
  { name: 'Photoshop', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg', color: '#31A8FF' },
  { name: 'Lightroom', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg', color: '#31A8FF' },
  { name: 'Premiere Pro', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg', color: '#9999FF' },
  { name: 'Canva', icon: 'https://www.vectorlogo.zone/logos/canva/canva-icon.svg', color: '#00C4CC' },
  { name: 'Word', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Microsoft_Word_2013-2019_logo.svg', color: '#2B579A' },
  { name: 'Excel', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg', color: '#217346' },
];

export const TIMELINE: TimelineEvent[] = [
  { date: 'Now', event: 'Dreaming', status: 'future' },
  { date: '2026', event: 'Site launched', status: 'present' },
  { date: '2023', event: 'Grad from secondary school', status: 'past' },
  { date: '2019', event: 'Became a cat owner', status: 'past' },
];

export const TRAVELLED_COUNTRIES = [
  { id: 'CN', name: 'China', lng: 104.195, lat: 35.861 },
  { id: 'HK', name: 'Hong Kong', lng: 114.169, lat: 22.319 },
  { id: 'JP', name: 'Japan', lng: 138.252, lat: 36.204 },
  { id: 'TH', name: 'Thailand', lng: 100.992, lat: 15.870 },
  { id: 'MY', name: 'Malaysia', lng: 101.975, lat: 4.210 },
  { id: 'US', name: 'USA', lng: -95.712, lat: 37.090 },
  { id: 'GB', name: 'England', lng: -1.174, lat: 52.355 },
  { id: 'AU', name: 'Australia', lng: 133.775, lat: -25.274 },
  { id: 'TW', name: 'Taiwan', lng: 120.960, lat: 23.697 },
  { id: 'VN', name: 'Vietnam', lng: 108.277, lat: 14.058 }
];
