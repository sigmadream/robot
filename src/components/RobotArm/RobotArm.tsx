'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { degToRad } from '@/lib/constants'
import { JointAngles } from '@/lib/types/robot'

interface RobotArmProps {
  jointAngles: JointAngles;
}

export default function RobotArm({ jointAngles }: RobotArmProps) {
  const baseRef = useRef<THREE.Group>(null)
  const shoulderRef = useRef<THREE.Group>(null)
  const elbowRef = useRef<THREE.Group>(null)
  const gripperRef = useRef<THREE.Group>(null)

  // 관절 각도를 부드럽게 애니메이션
  useFrame(() => {
    if (baseRef.current) {
      baseRef.current.rotation.y = degToRad(jointAngles.base)
    }
    if (shoulderRef.current) {
      shoulderRef.current.rotation.x = degToRad(jointAngles.shoulder)
    }
    if (elbowRef.current) {
      elbowRef.current.rotation.x = degToRad(jointAngles.elbow)
    }
  })

  return (
    <group>
      {/* 베이스 */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.5, 2]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* 회전 베이스 (Y축 회전) */}
      <group ref={baseRef} position={[0, 0.5, 0]}>
        {/* 베이스 관절 */}
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>

        {/* 어깨 관절 (X축 회전) */}
        <group ref={shoulderRef} position={[0, 0.3, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#e74c3c" />
          </mesh>

          {/* 상완 (Upper Arm) */}
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.2, 3, 16]} />
            <meshStandardMaterial color="#3498db" />
          </mesh>

          {/* 팔꿈치 관절 (X축 회전) */}
          <group ref={elbowRef} position={[0, 3, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#e74c3c" />
            </mesh>

            {/* 전완 (Forearm) */}
            <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.18, 2.5, 16]} />
              <meshStandardMaterial color="#3498db" />
            </mesh>

            {/* 그립퍼 베이스 */}
            <group ref={gripperRef} position={[0, 2.5, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.4, 0.3, 0.3]} />
                <meshStandardMaterial color="#95a5a6" />
              </mesh>

              {/* 그립퍼 왼쪽 */}
              <mesh 
                position={[-0.2 - jointAngles.gripper * 0.3, -0.25, 0]} 
                castShadow
              >
                <boxGeometry args={[0.15, 0.6, 0.1]} />
                <meshStandardMaterial color="#7f8c8d" />
              </mesh>

              {/* 그립퍼 오른쪽 */}
              <mesh 
                position={[0.2 + jointAngles.gripper * 0.3, -0.25, 0]} 
                castShadow
              >
                <boxGeometry args={[0.15, 0.6, 0.1]} />
                <meshStandardMaterial color="#7f8c8d" />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
