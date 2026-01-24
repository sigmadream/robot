'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei'
import HumanoidRobot from '../HumanoidRobot/HumanoidRobot'
import SoldierModel from '../HumanoidRobot/SoldierModel'
import RobotExpressiveModel from '../HumanoidRobot/RobotExpressiveModel'
import { HumanoidJointAngles, Position3D } from '@/lib/types/robot'

export type ModelType = 'gundam' | 'soldier' | 'robot'

interface RobotSceneProps {
  jointAngles: HumanoidJointAngles;
  modelType?: ModelType;
  position?: Position3D;
}

function Scene({ jointAngles, modelType = 'gundam', position = { x: 0, y: 0, z: 0 } }: RobotSceneProps) {
  return (
    <>
      {/* 카메라 설정 */}
      <PerspectiveCamera makeDefault position={[6, 5, 8]} fov={50} />

      {/* 컨트롤 */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={20}
        target={[position.x, 1.5 + position.y, position.z]}
      />

      {/* 조명 */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-5, 10, -5]}
        intensity={0.4}
        color="#b3d9ff"
      />
      <pointLight position={[0, 8, 5]} intensity={0.3} />

      {/* 모델 선택 */}
      {modelType === 'gundam' && <HumanoidRobot jointAngles={jointAngles} position={position} />}
      {modelType === 'soldier' && <SoldierModel jointAngles={jointAngles} position={position} />}
      {modelType === 'robot' && <RobotExpressiveModel jointAngles={jointAngles} position={position} />}

      {/* 그리드 */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6b7280"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#4b5563"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* 좌표축 헬퍼 */}
      <axesHelper args={[5]} />
    </>
  )
}

export default function RobotScene({ jointAngles, modelType = 'gundam', position = { x: 0, y: 0, z: 0 } }: RobotSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene jointAngles={jointAngles} modelType={modelType} position={position} />
        </Suspense>
      </Canvas>
    </div>
  )
}
