'use client'

interface ControlPanelProps {
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  onExamples: () => void;
  onClearWorkspace: () => void;
  executionSpeed: number;
  onSpeedChange: (speed: number) => void;
}

// 속도 레이블 생성
const getSpeedLabel = (speed: number): string => {
  if (speed < 1) {
    return `${speed.toFixed(2)}x`
  }
  return `${speed}x`
}

export default function ControlPanel({
  isRunning,
  onRun,
  onStop,
  onReset,
  onExamples,
  onClearWorkspace,
  executionSpeed,
  onSpeedChange,
}: ControlPanelProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onClearWorkspace}
        className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        🗑️ 블록 초기화
      </button>

      <button
        onClick={onRun}
        disabled={isRunning}
        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
      >
        {isRunning ? (
          <>
            <span className="animate-pulse">●</span> 실행 중...
          </>
        ) : (
          <>▶ 실행</>
        )}
      </button>

      <button
        onClick={onStop}
        disabled={!isRunning}
        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:text-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        ■ 중지
      </button>

      <button
        onClick={onReset}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        🔄 리셋
      </button>

      <div className="w-px h-8 bg-gray-600 mx-2" />

      {/* 속도 조절 슬라이더 */}
      <div className="flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded-lg">
        <span className="text-gray-300 text-sm whitespace-nowrap">속도:</span>
        <input
          type="range"
          min="0.25"
          max="4"
          step="0.25"
          value={executionSpeed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <span className="text-cyan-400 text-sm font-mono w-12 text-right">
          {getSpeedLabel(executionSpeed)}
        </span>
      </div>

      <div className="w-px h-8 bg-gray-600 mx-2" />

      <button
        onClick={onExamples}
        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        📚 예제
      </button>
    </div>
  )
}
