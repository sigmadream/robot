'use client'

import { JointAngles } from '@/lib/types/robot'

interface JointControlPanelProps {
  jointAngles: JointAngles
  onJointChange: (joint: keyof JointAngles, value: number) => void
  disabled?: boolean
}

interface JointSliderProps {
  label: string
  value: number
  min: number
  max: number
  unit: string
  color: string
  onChange: (value: number) => void
  disabled?: boolean
}

function JointSlider({ label, value, min, max, unit, color, onChange, disabled }: JointSliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className={`text-sm font-mono ${color}`}>
          {value.toFixed(1)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

export default function JointControlPanel({ jointAngles, onJointChange, disabled }: JointControlPanelProps) {
  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold text-white border-b border-gray-700 pb-2">
        관절 제어
      </h3>

      <JointSlider
        label="베이스 (Base)"
        value={jointAngles.base}
        min={-180}
        max={180}
        unit="°"
        color="text-red-400"
        onChange={(v) => onJointChange('base', v)}
        disabled={disabled}
      />

      <JointSlider
        label="어깨 (Shoulder)"
        value={jointAngles.shoulder}
        min={-90}
        max={90}
        unit="°"
        color="text-green-400"
        onChange={(v) => onJointChange('shoulder', v)}
        disabled={disabled}
      />

      <JointSlider
        label="팔꿈치 (Elbow)"
        value={jointAngles.elbow}
        min={-135}
        max={135}
        unit="°"
        color="text-blue-400"
        onChange={(v) => onJointChange('elbow', v)}
        disabled={disabled}
      />

      <div className="space-y-1 pt-2 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-300">그리퍼 (Gripper)</span>
          <span className="text-sm font-mono text-yellow-400">
            {jointAngles.gripper === 1 ? '열림' : '닫힘'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onJointChange('gripper', 0)}
            disabled={disabled}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              jointAngles.gripper === 0
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            닫기
          </button>
          <button
            onClick={() => onJointChange('gripper', 1)}
            disabled={disabled}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              jointAngles.gripper === 1
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            열기
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          onJointChange('base', 0)
          onJointChange('shoulder', 0)
          onJointChange('elbow', 0)
          onJointChange('gripper', 0)
        }}
        disabled={disabled}
        className="w-full py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        초기 위치로
      </button>
    </div>
  )
}
