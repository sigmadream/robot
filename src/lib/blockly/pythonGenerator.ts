import Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';

// ===== 휴머노이드 로봇 Python 코드 생성기 =====

// 단일 관절 회전
pythonGenerator.forBlock['humanoid_rotate_joint'] = function (block: Blockly.Block) {
  const joint = block.getFieldValue('JOINT');
  const angle = block.getFieldValue('ANGLE');
  const code = `await rotate_joint('${joint}', ${angle})\n`;
  return code;
};

// 그리퍼 제어
pythonGenerator.forBlock['humanoid_gripper'] = function (block: Blockly.Block) {
  const hand = block.getFieldValue('HAND');
  const action = block.getFieldValue('ACTION');
  const value = action === 'open' ? 1 : 0;

  if (hand === 'both') {
    return `await set_gripper('left', ${value})\nawait set_gripper('right', ${value})\n`;
  }
  return `await set_gripper('${hand}', ${value})\n`;
};

// 머리 방향 설정
pythonGenerator.forBlock['humanoid_head'] = function (block: Blockly.Block) {
  const yaw = block.getFieldValue('YAW');
  const pitch = block.getFieldValue('PITCH');
  const code = `await set_head_pose(${yaw}, ${pitch})\n`;
  return code;
};

// 팔 자세 설정
pythonGenerator.forBlock['humanoid_set_arm'] = function (block: Blockly.Block) {
  const arm = block.getFieldValue('ARM');
  const shoulderPitch = block.getFieldValue('SHOULDER_PITCH');
  const shoulderYaw = block.getFieldValue('SHOULDER_YAW');
  const elbow = block.getFieldValue('ELBOW');
  const wrist = block.getFieldValue('WRIST');
  const code = `await set_arm_pose('${arm}', ${shoulderPitch}, ${shoulderYaw}, ${elbow}, ${wrist})\n`;
  return code;
};

// 다리 자세 설정
pythonGenerator.forBlock['humanoid_set_leg'] = function (block: Blockly.Block) {
  const leg = block.getFieldValue('LEG');
  const hipPitch = block.getFieldValue('HIP_PITCH');
  const hipYaw = block.getFieldValue('HIP_YAW');
  const knee = block.getFieldValue('KNEE');
  const ankle = block.getFieldValue('ANKLE');
  const code = `await set_leg_pose('${leg}', ${hipPitch}, ${hipYaw}, ${knee}, ${ankle})\n`;
  return code;
};

// 프리셋 자세
pythonGenerator.forBlock['humanoid_preset_pose'] = function (block: Blockly.Block) {
  const pose = block.getFieldValue('POSE');
  const code = `await set_preset_pose('${pose}')\n`;
  return code;
};

// 초기 자세로
pythonGenerator.forBlock['humanoid_reset'] = function () {
  const code = `await reset_robot()\n`;
  return code;
};

// 대기
pythonGenerator.forBlock['humanoid_wait'] = function (block: Blockly.Block) {
  const duration = block.getFieldValue('DURATION');
  const code = `await wait(${duration})\n`;
  return code;
};

// 몸통 회전
pythonGenerator.forBlock['humanoid_torso'] = function (block: Blockly.Block) {
  const angle = block.getFieldValue('ANGLE');
  const code = `await rotate_joint('torso', ${angle})\n`;
  return code;
};

// ===== 이동 Python 코드 생성기 =====

// 앞으로 이동
pythonGenerator.forBlock['humanoid_move_forward'] = function (block: Blockly.Block) {
  const distance = block.getFieldValue('DISTANCE');
  const code = `await move_forward(${distance})\n`;
  return code;
};

// 뒤로 이동
pythonGenerator.forBlock['humanoid_move_backward'] = function (block: Blockly.Block) {
  const distance = block.getFieldValue('DISTANCE');
  const code = `await move_backward(${distance})\n`;
  return code;
};

// 왼쪽으로 이동
pythonGenerator.forBlock['humanoid_move_left'] = function (block: Blockly.Block) {
  const distance = block.getFieldValue('DISTANCE');
  const code = `await move_left(${distance})\n`;
  return code;
};

// 오른쪽으로 이동
pythonGenerator.forBlock['humanoid_move_right'] = function (block: Blockly.Block) {
  const distance = block.getFieldValue('DISTANCE');
  const code = `await move_right(${distance})\n`;
  return code;
};

// 점프
pythonGenerator.forBlock['humanoid_jump'] = function (block: Blockly.Block) {
  const height = block.getFieldValue('HEIGHT');
  const code = `await jump(${height})\n`;
  return code;
};

// 위치 초기화
pythonGenerator.forBlock['humanoid_reset_position'] = function () {
  const code = `await reset_position()\n`;
  return code;
};

// ===== 레거시 Python 코드 생성기 =====

pythonGenerator.forBlock['robot_rotate_joint'] = function (block: Blockly.Block) {
  const joint = block.getFieldValue('JOINT');
  const angle = block.getFieldValue('ANGLE');
  const jointMap: Record<string, string> = {
    'base': 'torso',
    'shoulder': 'rightShoulderPitch',
    'elbow': 'rightElbow',
  };
  const mappedJoint = jointMap[joint] || joint;
  const code = `await rotate_joint('${mappedJoint}', ${angle})\n`;
  return code;
};

pythonGenerator.forBlock['robot_gripper'] = function (block: Blockly.Block) {
  const action = block.getFieldValue('ACTION');
  const value = action === 'open' ? 1 : 0;
  const code = `await set_gripper('right', ${value})\n`;
  return code;
};

pythonGenerator.forBlock['robot_wait'] = function (block: Blockly.Block) {
  const duration = block.getFieldValue('DURATION');
  const code = `await wait(${duration})\n`;
  return code;
};

pythonGenerator.forBlock['robot_reset'] = function () {
  const code = `await reset_robot()\n`;
  return code;
};

pythonGenerator.forBlock['robot_set_all_joints'] = function (block: Blockly.Block) {
  const base = block.getFieldValue('BASE');
  const shoulder = block.getFieldValue('SHOULDER');
  const elbow = block.getFieldValue('ELBOW');
  const code = `await rotate_joint('torso', ${base})\nawait rotate_joint('rightShoulderPitch', ${shoulder})\nawait rotate_joint('rightElbow', ${elbow})\n`;
  return code;
};

export const generatePythonCode = (workspace: Blockly.WorkspaceSvg): string => {
  return pythonGenerator.workspaceToCode(workspace);
};
