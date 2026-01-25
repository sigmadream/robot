'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFExporter } from 'three-stdlib'
import type { SkeletonType } from '@/app/creator/page'

interface OutfitStyle {
  name: string
  color: string
  type: string
}

interface Accessory {
  name: string
  icon: string
  type: string
}

interface CreatorSceneProps {
  skeletonType: SkeletonType
  skinColor: string
  outfitStyle: OutfitStyle
  accessories: Accessory[]
}

// 스켈레톤 타입별 스케일
const SKELETON_SCALES: Record<SkeletonType, number> = {
  humanSmall: 0.8,
  humanMedium: 1.0,
  humanLarge: 1.3,
  quadruped: 0.7,
  biped: 1.1,
  bird: 0.5
}

type BodyPart = 'head' | 'torso' | 'leftArm' | 'rightArm' | 'leftHand' | 'rightHand' | 'leftLeg' | 'rightLeg' | 'leftFoot' | 'rightFoot'

// 의상 스타일에 따른 지오메트리 스타일 매핑
const getGeometryStyleFromOutfit = (outfitType: string): 'box' | 'rounded' | 'angular' | 'smooth' | 'mechanical' | 'organic' => {
  const styleMap: Record<string, 'box' | 'rounded' | 'angular' | 'smooth' | 'mechanical' | 'organic'> = {
    basic: 'box',
    casual: 'rounded',
    formal: 'smooth',
    sport: 'angular',
    military: 'mechanical',
    space: 'mechanical',
    ninja: 'angular',
    knight: 'mechanical',
    cyberpunk: 'angular',
    steampunk: 'mechanical',
    futuristic: 'smooth',
    mech: 'mechanical',
    robot: 'mechanical'
  }
  return styleMap[outfitType] || 'rounded'
}

interface BodyPartMeshProps {
  part: BodyPart
  skinColor: string
  outfitColor: string
  outfitType: string
  skeletonScale: number
  isHuman: boolean
}

function BodyPartMesh({ part, skinColor, outfitColor, outfitType, skeletonScale, isHuman }: BodyPartMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const style = getGeometryStyleFromOutfit(outfitType)

  // 부위별 색상 결정 (피부 vs 의상)
  const isSkinPart = part === 'head' || part === 'leftHand' || part === 'rightHand'
  const color = isSkinPart ? skinColor : outfitColor

  // 부위별 위치와 크기 설정 (사람형/동물형)
  const getPartConfig = (): { position: [number, number, number]; size: [number, number, number] } => {
    const s = skeletonScale
    if (isHuman) {
      switch (part) {
        case 'head':
          return { position: [0, 1.7 * s, 0], size: [0.25 * s, 0.3 * s, 0.25 * s] }
        case 'torso':
          return { position: [0, 1.1 * s, 0], size: [0.4 * s, 0.5 * s, 0.25 * s] }
        case 'leftArm':
          return { position: [-0.35 * s, 1.2 * s, 0], size: [0.12 * s, 0.35 * s, 0.12 * s] }
        case 'rightArm':
          return { position: [0.35 * s, 1.2 * s, 0], size: [0.12 * s, 0.35 * s, 0.12 * s] }
        case 'leftHand':
          return { position: [-0.35 * s, 0.75 * s, 0], size: [0.08 * s, 0.12 * s, 0.06 * s] }
        case 'rightHand':
          return { position: [0.35 * s, 0.75 * s, 0], size: [0.08 * s, 0.12 * s, 0.06 * s] }
        case 'leftLeg':
          return { position: [-0.15 * s, 0.45 * s, 0], size: [0.12 * s, 0.4 * s, 0.12 * s] }
        case 'rightLeg':
          return { position: [0.15 * s, 0.45 * s, 0], size: [0.12 * s, 0.4 * s, 0.12 * s] }
        case 'leftFoot':
          return { position: [-0.15 * s, 0.08 * s, 0.05 * s], size: [0.1 * s, 0.08 * s, 0.18 * s] }
        case 'rightFoot':
          return { position: [0.15 * s, 0.08 * s, 0.05 * s], size: [0.1 * s, 0.08 * s, 0.18 * s] }
        default:
          return { position: [0, 0, 0], size: [0.1, 0.1, 0.1] }
      }
    } else {
      // 동물형 체형 (4발, 2발, 새)
      switch (part) {
        case 'head':
          return { position: [0.5 * s, 0.8 * s, 0], size: [0.2 * s, 0.2 * s, 0.25 * s] }
        case 'torso':
          return { position: [0, 0.5 * s, 0], size: [0.6 * s, 0.3 * s, 0.25 * s] }
        case 'leftArm':
          return { position: [-0.2 * s, 0.25 * s, 0.2 * s], size: [0.08 * s, 0.25 * s, 0.08 * s] }
        case 'rightArm':
          return { position: [-0.2 * s, 0.25 * s, -0.2 * s], size: [0.08 * s, 0.25 * s, 0.08 * s] }
        case 'leftHand':
          return { position: [-0.2 * s, 0.05 * s, 0.2 * s], size: [0.06 * s, 0.05 * s, 0.08 * s] }
        case 'rightHand':
          return { position: [-0.2 * s, 0.05 * s, -0.2 * s], size: [0.06 * s, 0.05 * s, 0.08 * s] }
        case 'leftLeg':
          return { position: [0.25 * s, 0.25 * s, 0.15 * s], size: [0.08 * s, 0.25 * s, 0.08 * s] }
        case 'rightLeg':
          return { position: [0.25 * s, 0.25 * s, -0.15 * s], size: [0.08 * s, 0.25 * s, 0.08 * s] }
        case 'leftFoot':
          return { position: [0.25 * s, 0.05 * s, 0.15 * s], size: [0.06 * s, 0.05 * s, 0.08 * s] }
        case 'rightFoot':
          return { position: [0.25 * s, 0.05 * s, -0.15 * s], size: [0.06 * s, 0.05 * s, 0.08 * s] }
        default:
          return { position: [0, 0, 0], size: [0.1, 0.1, 0.1] }
      }
    }
  }

  const config = getPartConfig()

  // 스타일에 따른 지오메트리 생성
  const getGeometry = () => {
    const [w, h, d] = config.size
    switch (style) {
      case 'rounded':
        if (part === 'head') {
          return <sphereGeometry args={[w, 16, 16]} />
        }
        return <capsuleGeometry args={[Math.min(w, d) / 2, h - Math.min(w, d), 8, 16]} />
      case 'angular':
        return <boxGeometry args={[w * 1.1, h, d * 0.8]} />
      case 'smooth':
        return <cylinderGeometry args={[Math.min(w, d) / 2, Math.min(w, d) / 2 * 0.9, h, 16]} />
      case 'mechanical':
        return <boxGeometry args={[w, h, d]} />
      case 'organic':
        if (part === 'head') {
          return <sphereGeometry args={[w, 12, 12]} />
        }
        return <capsuleGeometry args={[Math.min(w, d) / 2 * 0.8, h - Math.min(w, d) * 0.8, 6, 12]} />
      default:
        return <boxGeometry args={[w, h, d]} />
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={config.position}
      name={part}
      castShadow
      receiveShadow
    >
      {getGeometry()}
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.5}
      />
    </mesh>
  )
}

interface RobotModelProps {
  skeletonType: SkeletonType
  skinColor: string
  outfitStyle: OutfitStyle
  accessories: Accessory[]
}

function RobotModel({ skeletonType, skinColor, outfitStyle, accessories }: RobotModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const scale = SKELETON_SCALES[skeletonType]
  const isHuman = skeletonType.startsWith('human')

  // 자동 회전
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
    }
  })

  // GLB 내보내기 이벤트 리스너
  useEffect(() => {
    const handleExport = (event: CustomEvent) => {
      if (!groupRef.current) return

      const exporter = new GLTFExporter()
      exporter.parse(
        groupRef.current,
        (result) => {
          const output = result as ArrayBuffer
          const blob = new Blob([output], { type: 'application/octet-stream' })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${event.detail.name || 'robot'}.glb`
          link.click()
          URL.revokeObjectURL(url)
        },
        (error) => {
          console.error('GLB 내보내기 오류:', error)
        },
        { binary: true }
      )
    }

    window.addEventListener('exportGLB', handleExport as EventListener)
    return () => {
      window.removeEventListener('exportGLB', handleExport as EventListener)
    }
  }, [])

  const bodyParts: BodyPart[] = [
    'head', 'torso', 'leftArm', 'rightArm',
    'leftHand', 'rightHand', 'leftLeg', 'rightLeg',
    'leftFoot', 'rightFoot'
  ]

  // 악세서리 렌더링
  const renderAccessories = () => {
    return accessories.map((acc, i) => {
      const accScale = scale * 0.15
      switch (acc.type) {
        case 'hat':
        case 'helmet':
        case 'crown':
          return (
            <mesh key={i} position={[0, (isHuman ? 1.95 : 0.95) * scale, 0]}>
              <cylinderGeometry args={[accScale, accScale * 1.2, accScale * 0.5, 16]} />
              <meshStandardMaterial color={acc.type === 'crown' ? '#FFD700' : '#4a4a4a'} metalness={0.5} />
            </mesh>
          )
        case 'glasses':
        case 'sunglasses':
          return (
            <mesh key={i} position={[0, (isHuman ? 1.75 : 0.85) * scale, 0.15 * scale]}>
              <boxGeometry args={[0.3 * scale, 0.05 * scale, 0.02 * scale]} />
              <meshStandardMaterial color={acc.type === 'sunglasses' ? '#1a1a1a' : '#888888'} />
            </mesh>
          )
        case 'backpack':
          return (
            <mesh key={i} position={[0, (isHuman ? 1.1 : 0.5) * scale, -0.2 * scale]}>
              <boxGeometry args={[0.25 * scale, 0.3 * scale, 0.15 * scale]} />
              <meshStandardMaterial color="#3B82F6" />
            </mesh>
          )
        case 'cape':
          return (
            <mesh key={i} position={[0, (isHuman ? 1.0 : 0.4) * scale, -0.15 * scale]}>
              <planeGeometry args={[0.4 * scale, 0.8 * scale]} />
              <meshStandardMaterial color="#DC143C" side={THREE.DoubleSide} />
            </mesh>
          )
        default:
          return null
      }
    })
  }

  return (
    <group ref={groupRef}>
      {bodyParts.map((part) => (
        <BodyPartMesh
          key={part}
          part={part}
          skinColor={skinColor}
          outfitColor={outfitStyle.color}
          outfitType={outfitStyle.type}
          skeletonScale={scale}
          isHuman={isHuman}
        />
      ))}

      {/* 관절 연결 표시 - 작은 구체로 */}
      {isHuman ? (
        [
          [0, 1.4 * scale, 0],
          [-0.2 * scale, 1.35 * scale, 0],
          [0.2 * scale, 1.35 * scale, 0],
          [-0.15 * scale, 0.65 * scale, 0],
          [0.15 * scale, 0.65 * scale, 0],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.03 * scale, 8, 8]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        ))
      ) : (
        [
          [0.3 * scale, 0.65 * scale, 0],
          [-0.2 * scale, 0.5 * scale, 0],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.03 * scale, 8, 8]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        ))
      )}

      {/* 악세서리 */}
      {renderAccessories()}
    </group>
  )
}

function Scene({ skeletonType, skinColor, outfitStyle, accessories }: CreatorSceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[3, 2, 4]} fov={50} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
        target={[0, 1, 0]}
      />

      {/* 조명 */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-3, 5, -3]} intensity={0.3} color="#b3d9ff" />
      <pointLight position={[0, 3, 3]} intensity={0.2} />

      {/* 로봇 모델 */}
      <RobotModel
        skeletonType={skeletonType}
        skinColor={skinColor}
        outfitStyle={outfitStyle}
        accessories={accessories}
      />

      {/* 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* 그리드 */}
      <Grid
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#4a4a6a"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#6a6a8a"
        fadeDistance={15}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
        position={[0, 0.01, 0]}
      />
    </>
  )
}

export default function CreatorScene(props: CreatorSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <Scene {...props} />
      </Canvas>
    </div>
  )
}
