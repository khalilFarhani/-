'use client';

import { 
  Scale, 
  GraduationCap, 
  Users, 
  BookOpen, 
  School, 
  Venus, 
  Mars,
  Award,
  ScrollText,
  Medal
} from 'lucide-react';

export default function PedagogicalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.02] z-0 overflow-hidden text-primary">
      {/* Education / Ta3lim */}
      <div className="absolute top-[10%] left-[5%] animate-float"><School size={70} /></div>
      <div className="absolute bottom-[10%] right-[5%] animate-float-delayed"><BookOpen size={60} /></div>
      <div className="absolute top-[40%] right-[10%] animate-float"><Scale size={65} /></div>
      
      {/* Gender */}
      <div className="absolute bottom-[25%] left-[5%] animate-float-delayed"><Venus size={70} /></div>
      <div className="absolute top-[20%] right-[15%] animate-float"><Mars size={60} /></div>
      <div className="absolute bottom-[50%] left-[10%] animate-float-delayed"><Users size={55} /></div>

      {/* Graduation PFE */}
      <div className="absolute top-[30%] left-[40%] animate-float"><GraduationCap size={80} /></div>
      <div className="absolute bottom-[20%] right-[40%] animate-float-delayed"><Award size={65} /></div>
      <div className="absolute top-[5%] right-[40%] animate-float"><ScrollText size={50} /></div>
      <div className="absolute bottom-[5%] left-[40%] animate-float-delayed"><Medal size={60} /></div>
    </div>
  );
}
