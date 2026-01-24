import Blockly from 'blockly';

// 로봇 제어 블록 카테고리 색상
const ROBOT_COLOR = '#4CAF50';
const HEAD_COLOR = '#9C27B0';
const ARM_COLOR = '#2196F3';
const LEG_COLOR = '#FF5722';
const CONTROL_COLOR = '#FF9800';
const MOVEMENT_COLOR = '#00BCD4';

// ===== 휴머노이드 로봇 블록 =====

// 1. 단일 관절 회전 블록
Blockly.Blocks['humanoid_rotate_joint'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('관절 회전')
      .appendField(
        new Blockly.FieldDropdown([
          ['몸통', 'torso'],
          ['목 좌우', 'neckYaw'],
          ['목 상하', 'neckPitch'],
          ['왼쪽 어깨 상하', 'leftShoulderPitch'],
          ['왼쪽 어깨 좌우', 'leftShoulderYaw'],
          ['왼쪽 팔꿈치', 'leftElbow'],
          ['왼쪽 손목', 'leftWrist'],
          ['오른쪽 어깨 상하', 'rightShoulderPitch'],
          ['오른쪽 어깨 좌우', 'rightShoulderYaw'],
          ['오른쪽 팔꿈치', 'rightElbow'],
          ['오른쪽 손목', 'rightWrist'],
          ['왼쪽 엉덩이 상하', 'leftHipPitch'],
          ['왼쪽 엉덩이 좌우', 'leftHipYaw'],
          ['왼쪽 무릎', 'leftKnee'],
          ['왼쪽 발목', 'leftAnkle'],
          ['오른쪽 엉덩이 상하', 'rightHipPitch'],
          ['오른쪽 엉덩이 좌우', 'rightHipYaw'],
          ['오른쪽 무릎', 'rightKnee'],
          ['오른쪽 발목', 'rightAnkle'],
        ]),
        'JOINT'
      )
      .appendField('각도')
      .appendField(new Blockly.FieldNumber(0, -180, 180), 'ANGLE')
      .appendField('도');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(ROBOT_COLOR);
    this.setTooltip('지정한 관절을 특정 각도로 회전합니다');
    this.setHelpUrl('');
  },
};

// 2. 그리퍼 제어 블록
Blockly.Blocks['humanoid_gripper'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ['왼손', 'left'],
          ['오른손', 'right'],
          ['양손', 'both'],
        ]),
        'HAND'
      )
      .appendField('그리퍼')
      .appendField(
        new Blockly.FieldDropdown([
          ['열기', 'open'],
          ['닫기', 'close'],
        ]),
        'ACTION'
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(ARM_COLOR);
    this.setTooltip('그리퍼를 열거나 닫습니다');
    this.setHelpUrl('');
  },
};

// 3. 머리 방향 설정 블록
Blockly.Blocks['humanoid_head'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('머리 방향');
    this.appendDummyInput()
      .appendField('좌우')
      .appendField(new Blockly.FieldNumber(0, -90, 90), 'YAW')
      .appendField('도');
    this.appendDummyInput()
      .appendField('상하')
      .appendField(new Blockly.FieldNumber(0, -45, 45), 'PITCH')
      .appendField('도');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(HEAD_COLOR);
    this.setTooltip('머리 방향을 설정합니다');
    this.setHelpUrl('');
  },
};

// 4. 팔 자세 설정 블록
Blockly.Blocks['humanoid_set_arm'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ['왼팔', 'left'],
          ['오른팔', 'right'],
        ]),
        'ARM'
      )
      .appendField('자세 설정');
    this.appendDummyInput()
      .appendField('어깨 상하')
      .appendField(new Blockly.FieldNumber(0, -180, 60), 'SHOULDER_PITCH')
      .appendField('도');
    this.appendDummyInput()
      .appendField('어깨 좌우')
      .appendField(new Blockly.FieldNumber(0, -180, 180), 'SHOULDER_YAW')
      .appendField('도');
    this.appendDummyInput()
      .appendField('팔꿈치')
      .appendField(new Blockly.FieldNumber(0, -135, 0), 'ELBOW')
      .appendField('도');
    this.appendDummyInput()
      .appendField('손목')
      .appendField(new Blockly.FieldNumber(0, -90, 90), 'WRIST')
      .appendField('도');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(ARM_COLOR);
    this.setTooltip('팔의 전체 자세를 설정합니다');
    this.setHelpUrl('');
  },
};

// 5. 다리 자세 설정 블록
Blockly.Blocks['humanoid_set_leg'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ['왼다리', 'left'],
          ['오른다리', 'right'],
        ]),
        'LEG'
      )
      .appendField('자세 설정');
    this.appendDummyInput()
      .appendField('엉덩이 상하')
      .appendField(new Blockly.FieldNumber(0, -90, 45), 'HIP_PITCH')
      .appendField('도');
    this.appendDummyInput()
      .appendField('엉덩이 좌우')
      .appendField(new Blockly.FieldNumber(0, -45, 45), 'HIP_YAW')
      .appendField('도');
    this.appendDummyInput()
      .appendField('무릎')
      .appendField(new Blockly.FieldNumber(0, 0, 135), 'KNEE')
      .appendField('도');
    this.appendDummyInput()
      .appendField('발목')
      .appendField(new Blockly.FieldNumber(0, -45, 45), 'ANKLE')
      .appendField('도');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(LEG_COLOR);
    this.setTooltip('다리의 전체 자세를 설정합니다');
    this.setHelpUrl('');
  },
};

// 6. 프리셋 자세 블록
Blockly.Blocks['humanoid_preset_pose'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('자세:')
      .appendField(
        new Blockly.FieldDropdown([
          ['T포즈', 'tpose'],
          ['서기', 'stand'],
          ['인사', 'wave'],
          ['박수', 'clap'],
          ['걷기 준비', 'walk_ready'],
          ['절', 'bow'],
        ]),
        'POSE'
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(ROBOT_COLOR);
    this.setTooltip('미리 정의된 자세를 취합니다');
    this.setHelpUrl('');
  },
};

// 7. 초기 위치로 이동 블록
Blockly.Blocks['humanoid_reset'] = {
  init: function () {
    this.appendDummyInput().appendField('초기 자세로');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(ROBOT_COLOR);
    this.setTooltip('로봇을 초기 자세(T포즈)로 이동합니다');
    this.setHelpUrl('');
  },
};

// 8. 대기 블록
Blockly.Blocks['humanoid_wait'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('대기')
      .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), 'DURATION')
      .appendField('초');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CONTROL_COLOR);
    this.setTooltip('지정한 시간동안 대기합니다');
    this.setHelpUrl('');
  },
};

// 9. 몸통 회전 블록
Blockly.Blocks['humanoid_torso'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('몸통 회전')
      .appendField(new Blockly.FieldNumber(0, -45, 45), 'ANGLE')
      .appendField('도');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(HEAD_COLOR);
    this.setTooltip('몸통을 좌우로 회전합니다');
    this.setHelpUrl('');
  },
};

// ===== 이동 블록 =====

// 10. 앞으로 이동 블록
Blockly.Blocks['humanoid_move_forward'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('앞으로 이동')
      .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), 'DISTANCE')
      .appendField('m');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(MOVEMENT_COLOR);
    this.setTooltip('로봇을 앞으로 이동합니다');
    this.setHelpUrl('');
  },
};

// 11. 뒤로 이동 블록
Blockly.Blocks['humanoid_move_backward'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('뒤로 이동')
      .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), 'DISTANCE')
      .appendField('m');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(MOVEMENT_COLOR);
    this.setTooltip('로봇을 뒤로 이동합니다');
    this.setHelpUrl('');
  },
};

// 12. 왼쪽으로 이동 블록
Blockly.Blocks['humanoid_move_left'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('왼쪽으로 이동')
      .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), 'DISTANCE')
      .appendField('m');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(MOVEMENT_COLOR);
    this.setTooltip('로봇을 왼쪽으로 이동합니다');
    this.setHelpUrl('');
  },
};

// 13. 오른쪽으로 이동 블록
Blockly.Blocks['humanoid_move_right'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('오른쪽으로 이동')
      .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), 'DISTANCE')
      .appendField('m');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(MOVEMENT_COLOR);
    this.setTooltip('로봇을 오른쪽으로 이동합니다');
    this.setHelpUrl('');
  },
};

// 14. 점프 블록
Blockly.Blocks['humanoid_jump'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('점프')
      .appendField(new Blockly.FieldNumber(1, 0.5, 3, 0.1), 'HEIGHT')
      .appendField('m');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(MOVEMENT_COLOR);
    this.setTooltip('로봇이 점프합니다');
    this.setHelpUrl('');
  },
};

// 15. 위치 초기화 블록
Blockly.Blocks['humanoid_reset_position'] = {
  init: function () {
    this.appendDummyInput().appendField('위치 초기화');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(MOVEMENT_COLOR);
    this.setTooltip('로봇을 원점으로 이동합니다');
    this.setHelpUrl('');
  },
};

// ===== 레거시 블록 (호환성 유지) =====

// 1. 관절 회전 블록 (레거시)
Blockly.Blocks['robot_rotate_joint'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('[레거시] 관절 회전')
      .appendField(
        new Blockly.FieldDropdown([
          ['베이스', 'base'],
          ['어깨', 'shoulder'],
          ['팔꿈치', 'elbow'],
        ]),
        'JOINT'
      )
      .appendField('각도')
      .appendField(new Blockly.FieldNumber(0, -180, 180), 'ANGLE')
      .appendField('도');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#9E9E9E');
    this.setTooltip('[레거시] 이 블록은 구버전 호환용입니다');
    this.setHelpUrl('');
  },
};

// 2. 그립퍼 제어 블록 (레거시)
Blockly.Blocks['robot_gripper'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('[레거시] 그립퍼')
      .appendField(
        new Blockly.FieldDropdown([
          ['열기', 'open'],
          ['닫기', 'close'],
        ]),
        'ACTION'
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#9E9E9E');
    this.setTooltip('[레거시] 이 블록은 구버전 호환용입니다');
    this.setHelpUrl('');
  },
};

// 3. 대기 블록 (레거시)
Blockly.Blocks['robot_wait'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('[레거시] 대기')
      .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), 'DURATION')
      .appendField('초');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#9E9E9E');
    this.setTooltip('[레거시] 이 블록은 구버전 호환용입니다');
    this.setHelpUrl('');
  },
};

// 4. 초기 위치로 이동 블록 (레거시)
Blockly.Blocks['robot_reset'] = {
  init: function () {
    this.appendDummyInput().appendField('[레거시] 초기 위치로');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#9E9E9E');
    this.setTooltip('[레거시] 이 블록은 구버전 호환용입니다');
    this.setHelpUrl('');
  },
};

// 5. 모든 관절 한번에 설정 블록 (레거시)
Blockly.Blocks['robot_set_all_joints'] = {
  init: function () {
    this.appendDummyInput().appendField('[레거시] 모든 관절 설정');
    this.appendDummyInput()
      .appendField('베이스')
      .appendField(new Blockly.FieldNumber(0, -180, 180), 'BASE')
      .appendField('도');
    this.appendDummyInput()
      .appendField('어깨')
      .appendField(new Blockly.FieldNumber(0, -90, 90), 'SHOULDER')
      .appendField('도');
    this.appendDummyInput()
      .appendField('팔꿈치')
      .appendField(new Blockly.FieldNumber(0, -135, 135), 'ELBOW')
      .appendField('도');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#9E9E9E');
    this.setTooltip('[레거시] 이 블록은 구버전 호환용입니다');
    this.setHelpUrl('');
  },
};

export const initCustomBlocks = () => {
  // 블록이 이미 등록되어 있는지 확인하고 중복 등록 방지
  console.log('Custom blocks initialized (Humanoid Robot)');
};
