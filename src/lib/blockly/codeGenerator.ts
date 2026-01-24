import Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// ===== 휴머노이드 로봇 코드 생성기 =====

// 단일 관절 회전
javascriptGenerator.forBlock['humanoid_rotate_joint'] = function (block: Blockly.Block) {
  const joint = block.getFieldValue('JOINT');
  const angle = block.getFieldValue('ANGLE');
  const code = `await rotateJoint('${joint}', ${angle});\n`;
  return code;
};

// 그리퍼 제어
javascriptGenerator.forBlock['humanoid_gripper'] = function (block: Blockly.Block) {
  const hand = block.getFieldValue('HAND');
  const action = block.getFieldValue('ACTION');
  const value = action === 'open' ? 1 : 0;

  if (hand === 'both') {
    return `await setGripper('left', ${value});\nawait setGripper('right', ${value});\n`;
  }
  return `await setGripper('${hand}', ${value});\n`;
};

// 머리 방향 설정
javascriptGenerator.forBlock['humanoid_head'] = function (block: Blockly.Block) {
  const yaw = block.getFieldValue('YAW');
  const pitch = block.getFieldValue('PITCH');
  const code = `await setHeadPose(${yaw}, ${pitch});\n`;
  return code;
};

// 팔 자세 설정
javascriptGenerator.forBlock['humanoid_set_arm'] = function (block: Blockly.Block) {
  const arm = block.getFieldValue('ARM');
  const shoulderPitch = block.getFieldValue('SHOULDER_PITCH');
  const shoulderYaw = block.getFieldValue('SHOULDER_YAW');
  const elbow = block.getFieldValue('ELBOW');
  const wrist = block.getFieldValue('WRIST');
  const code = `await setArmPose('${arm}', ${shoulderPitch}, ${shoulderYaw}, ${elbow}, ${wrist});\n`;
  return code;
};

// 다리 자세 설정
javascriptGenerator.forBlock['humanoid_set_leg'] = function (block: Blockly.Block) {
  const leg = block.getFieldValue('LEG');
  const hipPitch = block.getFieldValue('HIP_PITCH');
  const hipYaw = block.getFieldValue('HIP_YAW');
  const knee = block.getFieldValue('KNEE');
  const ankle = block.getFieldValue('ANKLE');
  const code = `await setLegPose('${leg}', ${hipPitch}, ${hipYaw}, ${knee}, ${ankle});\n`;
  return code;
};

// 프리셋 자세
javascriptGenerator.forBlock['humanoid_preset_pose'] = function (block: Blockly.Block) {
  const pose = block.getFieldValue('POSE');
  const code = `await setPresetPose('${pose}');\n`;
  return code;
};

// 초기 자세로
javascriptGenerator.forBlock['humanoid_reset'] = function () {
  const code = `await resetRobot();\n`;
  return code;
};

// 대기
javascriptGenerator.forBlock['humanoid_wait'] = function (block: Blockly.Block) {
  const duration = block.getFieldValue('DURATION');
  const code = `await wait(${duration});\n`;
  return code;
};

// 몸통 회전
javascriptGenerator.forBlock['humanoid_torso'] = function (block: Blockly.Block) {
  const angle = block.getFieldValue('ANGLE');
  const code = `await rotateJoint('torso', ${angle});\n`;
  return code;
};

// ===== 이동 코드 생성기 =====

// 앞으로 이동
javascriptGenerator.forBlock['humanoid_move_forward'] = function (block: Blockly.Block) {
  const distance = block.getFieldValue('DISTANCE');
  const code = `await moveForward(${distance});\n`;
  return code;
};

// 뒤로 이동
javascriptGenerator.forBlock['humanoid_move_backward'] = function (block: Blockly.Block) {
  const distance = block.getFieldValue('DISTANCE');
  const code = `await moveBackward(${distance});\n`;
  return code;
};

// 왼쪽으로 이동
javascriptGenerator.forBlock['humanoid_move_left'] = function (block: Blockly.Block) {
  const distance = block.getFieldValue('DISTANCE');
  const code = `await moveLeft(${distance});\n`;
  return code;
};

// 오른쪽으로 이동
javascriptGenerator.forBlock['humanoid_move_right'] = function (block: Blockly.Block) {
  const distance = block.getFieldValue('DISTANCE');
  const code = `await moveRight(${distance});\n`;
  return code;
};

// 점프
javascriptGenerator.forBlock['humanoid_jump'] = function (block: Blockly.Block) {
  const height = block.getFieldValue('HEIGHT');
  const code = `await jump(${height});\n`;
  return code;
};

// 위치 초기화
javascriptGenerator.forBlock['humanoid_reset_position'] = function () {
  const code = `await resetPosition();\n`;
  return code;
};

// ===== 레거시 코드 생성기 (호환성 유지) =====

javascriptGenerator.forBlock['robot_rotate_joint'] = function (block: Blockly.Block) {
  const joint = block.getFieldValue('JOINT');
  const angle = block.getFieldValue('ANGLE');
  // 레거시 관절을 휴머노이드 관절로 매핑
  const jointMap: Record<string, string> = {
    'base': 'torso',
    'shoulder': 'rightShoulderPitch',
    'elbow': 'rightElbow',
  };
  const mappedJoint = jointMap[joint] || joint;
  const code = `await rotateJoint('${mappedJoint}', ${angle});\n`;
  return code;
};

javascriptGenerator.forBlock['robot_gripper'] = function (block: Blockly.Block) {
  const action = block.getFieldValue('ACTION');
  const value = action === 'open' ? 1 : 0;
  const code = `await setGripper('right', ${value});\n`;
  return code;
};

javascriptGenerator.forBlock['robot_wait'] = function (block: Blockly.Block) {
  const duration = block.getFieldValue('DURATION');
  const code = `await wait(${duration});\n`;
  return code;
};

javascriptGenerator.forBlock['robot_reset'] = function () {
  const code = `await resetRobot();\n`;
  return code;
};

javascriptGenerator.forBlock['robot_set_all_joints'] = function (block: Blockly.Block) {
  const base = block.getFieldValue('BASE');
  const shoulder = block.getFieldValue('SHOULDER');
  const elbow = block.getFieldValue('ELBOW');
  // 레거시 함수를 휴머노이드 관절로 변환
  const code = `await rotateJoint('torso', ${base});\nawait rotateJoint('rightShoulderPitch', ${shoulder});\nawait rotateJoint('rightElbow', ${elbow});\n`;
  return code;
};

export const generateCode = (workspace: Blockly.WorkspaceSvg): string => {
  return javascriptGenerator.workspaceToCode(workspace);
};
