import React from 'react';
import { Music2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-wood-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <Music2 className="w-16 h-16 text-wood-400 animate-bounce" />
      </div>
      <p className="text-wood-100 text-lg font-medium animate-pulse">
        코드를 분석하고 있습니다...
      </p>
      <p className="text-slate-400 text-sm">Gemini가 기타 운지법을 생성 중입니다</p>
    </div>
  );
};

export default LoadingState;