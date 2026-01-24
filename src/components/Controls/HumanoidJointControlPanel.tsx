'use client'

import { useState } from 'react'
import { HumanoidJointAngles, HumanoidJointKey, HUMANOID_JOINT_LIMITS, PRESET_POSES, PresetPoseName, Position3D } from '@/lib/types/robot'

interface HumanoidJointControlPanelProps {
  jointAngles: HumanoidJointAngles
  onJointChange: (joint: HumanoidJointKey, value: number) => void
  onPresetPose: (pose: PresetPoseName) => void
  position: Position3D
  onPositionChange: (position: Position3D) => void
  disabled?: boolean
}

interface JointSliderProps {
  label: string
  jointKey: HumanoidJointKey
  value: number
  color: string
  onChange: (value: number) => void
  disabled?: boolean
}

interface CollapsibleSectionProps {
  title: string
  color: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function CollapsibleSection({ title, color, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 ${color} text-white text-sm font-medium`}
      >
        <span>{title}</span>
        <span className="text-lg">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-3 space-y-3 bg-gray-800/50">
          {children}
        </div>
      )}
    </div>
  )
}

interface PositionSliderProps {
  label: string
  axis: 'x' | 'y' | 'z'
  value: number
  color: string
  onChange: (value: number) => void
  disabled?: boolean
}

function PositionSlider({ label, axis, value, color, onChange, disabled }: PositionSliderProps) {
  const min = -10
  const max = 10

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-300">{label}</span>
        <span className={`text-xs font-mono ${color}`}>
          {value.toFixed(1)}m
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>{min}m</span>
        <span>{max}m</span>
      </div>
    </div>
  )
}

function JointSlider({ label, jointKey, value, color, onChange, disabled }: JointSliderProps) {
  const limits = HUMANOID_JOINT_LIMITS[jointKey]
  const isGripper = jointKey.includes('Grip')

  if (isGripper) {
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-300">{label}</span>
          <span className={`text-xs font-mono ${color}`}>
            {value === 1 ? '열림' : '닫힘'}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onChange(0)}
            disabled={disabled}
            className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
              value === 0
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            닫기
          </button>
          <button
            onClick={() => onChange(1)}
            disabled={disabled}
            className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
              value === 1
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            열기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-300">{label}</span>
        <span className={`text-xs font-mono ${color}`}>
          {value.toFixed(0)}°
        </span>
      </div>
      <input
        type="range"
        min={limits.min}
        max={limits.max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>{limits.min}°</span>
        <span>{limits.max}°</span>
      </div>
    </div>
  )
}

export default function HumanoidJointControlPanel({
  jointAngles,
  onJointChange,
  onPresetPose,
  position,
  onPositionChange,
  disabled
}: HumanoidJointControlPanelProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // 패널이 닫혀있을 때 - 열기 버튼만 표시
  if (!isPanelOpen) {
    return (
      <button
        onClick={() => setIsPanelOpen(true)}
        className="bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm font-medium hover:bg-gray-700/90 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        관절 제어
      </button>
    )
  }

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="flex items-center justify-between border-b border-gray-700 pb-2">
        <h3 className="text-sm font-semibold text-white">
          휴머노이드 제어
        </h3>
        <button
          onClick={() => setIsPanelOpen(false)}
          className="p-1 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
          title="패널 닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 프리셋 자세 버튼들 */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-gray-400">프리셋 자세</span>
        <div className="grid grid-cols-3 gap-1">
          {(Object.keys(PRESET_POSES) as PresetPoseName[]).map((poseName) => (
            <button
              key={poseName}
              onClick={() => onPresetPose(poseName)}
              disabled={disabled}
              className="py-1.5 px-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {poseName === 'tpose' ? 'T포즈' :
               poseName === 'stand' ? '서기' :
               poseName === 'wave' ? '인사' :
               poseName === 'clap' ? '박수' :
               poseName === 'walk_ready' ? '걷기준비' :
               poseName === 'bow' ? '절' : poseName}
            </button>
          ))}
        </div>
      </div>

      {/* 위치 이동 */}
      <CollapsibleSection title="위치 이동" color="bg-cyan-600" defaultOpen={true}>
        <PositionSlider
          label="X (좌우)"
          axis="x"
          value={position.x}
          color="text-cyan-400"
          onChange={(v) => onPositionChange({ ...position, x: v })}
          disabled={disabled}
        />
        <PositionSlider
          label="Y (상하)"
          axis="y"
          value={position.y}
          color="text-cyan-400"
          onChange={(v) => onPositionChange({ ...position, y: v })}
          disabled={disabled}
        />
        <PositionSlider
          label="Z (앞뒤)"
          axis="z"
          value={position.z}
          color="text-cyan-400"
          onChange={(v) => onPositionChange({ ...position, z: v })}
          disabled={disabled}
        />
        <button
          onClick={() => onPositionChange({ x: 0, y: 0, z: 0 })}
          disabled={disabled}
          className="w-full py-1.5 px-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          위치 초기화
        </button>
      </CollapsibleSection>

      {/* 머리/몸통 */}
      <CollapsibleSection title="머리/몸통" color="bg-purple-600" defaultOpen={true}>
        <JointSlider
          label="몸통 (Torso)"
          jointKey="torso"
          value={jointAngles.torso}
          color="text-purple-400"
          onChange={(v) => onJointChange('torso', v)}
          disabled={disabled}
        />
        <JointSlider
          label="목 좌우 (Neck Yaw)"
          jointKey="neckYaw"
          value={jointAngles.neckYaw}
          color="text-purple-400"
          onChange={(v) => onJointChange('neckYaw', v)}
          disabled={disabled}
        />
        <JointSlider
          label="목 상하 (Neck Pitch)"
          jointKey="neckPitch"
          value={jointAngles.neckPitch}
          color="text-purple-400"
          onChange={(v) => onJointChange('neckPitch', v)}
          disabled={disabled}
        />
      </CollapsibleSection>

      {/* 왼팔 */}
      <CollapsibleSection title="왼팔" color="bg-blue-600">
        <JointSlider
          label="어깨 상하 (Shoulder Pitch)"
          jointKey="leftShoulderPitch"
          value={jointAngles.leftShoulderPitch}
          color="text-blue-400"
          onChange={(v) => onJointChange('leftShoulderPitch', v)}
          disabled={disabled}
        />
        <JointSlider
          label="어깨 좌우 (Shoulder Yaw)"
          jointKey="leftShoulderYaw"
          value={jointAngles.leftShoulderYaw}
          color="text-blue-400"
          onChange={(v) => onJointChange('leftShoulderYaw', v)}
          disabled={disabled}
        />
        <JointSlider
          label="팔꿈치 (Elbow)"
          jointKey="leftElbow"
          value={jointAngles.leftElbow}
          color="text-blue-400"
          onChange={(v) => onJointChange('leftElbow', v)}
          disabled={disabled}
        />
        <JointSlider
          label="손목 (Wrist)"
          jointKey="leftWrist"
          value={jointAngles.leftWrist}
          color="text-blue-400"
          onChange={(v) => onJointChange('leftWrist', v)}
          disabled={disabled}
        />
        <JointSlider
          label="그립퍼 (Grip)"
          jointKey="leftGrip"
          value={jointAngles.leftGrip}
          color="text-yellow-400"
          onChange={(v) => onJointChange('leftGrip', v)}
          disabled={disabled}
        />
      </CollapsibleSection>

      {/* 오른팔 */}
      <CollapsibleSection title="오른팔" color="bg-green-600">
        <JointSlider
          label="어깨 상하 (Shoulder Pitch)"
          jointKey="rightShoulderPitch"
          value={jointAngles.rightShoulderPitch}
          color="text-green-400"
          onChange={(v) => onJointChange('rightShoulderPitch', v)}
          disabled={disabled}
        />
        <JointSlider
          label="어깨 좌우 (Shoulder Yaw)"
          jointKey="rightShoulderYaw"
          value={jointAngles.rightShoulderYaw}
          color="text-green-400"
          onChange={(v) => onJointChange('rightShoulderYaw', v)}
          disabled={disabled}
        />
        <JointSlider
          label="팔꿈치 (Elbow)"
          jointKey="rightElbow"
          value={jointAngles.rightElbow}
          color="text-green-400"
          onChange={(v) => onJointChange('rightElbow', v)}
          disabled={disabled}
        />
        <JointSlider
          label="손목 (Wrist)"
          jointKey="rightWrist"
          value={jointAngles.rightWrist}
          color="text-green-400"
          onChange={(v) => onJointChange('rightWrist', v)}
          disabled={disabled}
        />
        <JointSlider
          label="그립퍼 (Grip)"
          jointKey="rightGrip"
          value={jointAngles.rightGrip}
          color="text-yellow-400"
          onChange={(v) => onJointChange('rightGrip', v)}
          disabled={disabled}
        />
      </CollapsibleSection>

      {/* 왼다리 */}
      <CollapsibleSection title="왼다리" color="bg-orange-600">
        <JointSlider
          label="엉덩이 상하 (Hip Pitch)"
          jointKey="leftHipPitch"
          value={jointAngles.leftHipPitch}
          color="text-orange-400"
          onChange={(v) => onJointChange('leftHipPitch', v)}
          disabled={disabled}
        />
        <JointSlider
          label="엉덩이 좌우 (Hip Yaw)"
          jointKey="leftHipYaw"
          value={jointAngles.leftHipYaw}
          color="text-orange-400"
          onChange={(v) => onJointChange('leftHipYaw', v)}
          disabled={disabled}
        />
        <JointSlider
          label="무릎 (Knee)"
          jointKey="leftKnee"
          value={jointAngles.leftKnee}
          color="text-orange-400"
          onChange={(v) => onJointChange('leftKnee', v)}
          disabled={disabled}
        />
        <JointSlider
          label="발목 (Ankle)"
          jointKey="leftAnkle"
          value={jointAngles.leftAnkle}
          color="text-orange-400"
          onChange={(v) => onJointChange('leftAnkle', v)}
          disabled={disabled}
        />
      </CollapsibleSection>

      {/* 오른다리 */}
      <CollapsibleSection title="오른다리" color="bg-red-600">
        <JointSlider
          label="엉덩이 상하 (Hip Pitch)"
          jointKey="rightHipPitch"
          value={jointAngles.rightHipPitch}
          color="text-red-400"
          onChange={(v) => onJointChange('rightHipPitch', v)}
          disabled={disabled}
        />
        <JointSlider
          label="엉덩이 좌우 (Hip Yaw)"
          jointKey="rightHipYaw"
          value={jointAngles.rightHipYaw}
          color="text-red-400"
          onChange={(v) => onJointChange('rightHipYaw', v)}
          disabled={disabled}
        />
        <JointSlider
          label="무릎 (Knee)"
          jointKey="rightKnee"
          value={jointAngles.rightKnee}
          color="text-red-400"
          onChange={(v) => onJointChange('rightKnee', v)}
          disabled={disabled}
        />
        <JointSlider
          label="발목 (Ankle)"
          jointKey="rightAnkle"
          value={jointAngles.rightAnkle}
          color="text-red-400"
          onChange={(v) => onJointChange('rightAnkle', v)}
          disabled={disabled}
        />
      </CollapsibleSection>
    </div>
  )
}
