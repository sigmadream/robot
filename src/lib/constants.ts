import { RobotConfig } from './types/robot';

// 로봇 팔 기본 설정
export const DEFAULT_ROBOT_CONFIG: RobotConfig = {
  baseDimensions: {
    width: 2,
    height: 0.5,
    depth: 2,
  },
  armSegments: {
    upperArm: 3,
    forearm: 2.5,
  },
  colors: {
    base: '#2c3e50',
    joint: '#e74c3c',
    arm: '#3498db',
    gripper: '#95a5a6',
  },
};

// 각도를 라디안으로 변환
export const degToRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

// 라디안을 각도로 변환
export const radToDeg = (radians: number): number => {
  return (radians * 180) / Math.PI;
};
