export const BLOCKLY_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '로봇 제어',
      colour: '#4CAF50',
      contents: [
        {
          kind: 'block',
          type: 'humanoid_reset',
        },
        {
          kind: 'block',
          type: 'humanoid_preset_pose',
          fields: {
            POSE: 'stand',
          },
        },
        {
          kind: 'block',
          type: 'humanoid_rotate_joint',
          fields: {
            JOINT: 'torso',
            ANGLE: 0,
          },
        },
      ],
    },
    {
      kind: 'category',
      name: '머리/몸통',
      colour: '#9C27B0',
      contents: [
        {
          kind: 'block',
          type: 'humanoid_head',
          fields: {
            YAW: 0,
            PITCH: 0,
          },
        },
        {
          kind: 'block',
          type: 'humanoid_torso',
          fields: {
            ANGLE: 0,
          },
        },
      ],
    },
    {
      kind: 'category',
      name: '팔 동작',
      colour: '#2196F3',
      contents: [
        {
          kind: 'block',
          type: 'humanoid_set_arm',
          fields: {
            ARM: 'right',
            SHOULDER_PITCH: 0,
            SHOULDER_YAW: -90,
            ELBOW: 0,
            WRIST: 0,
          },
        },
        {
          kind: 'block',
          type: 'humanoid_gripper',
          fields: {
            HAND: 'right',
            ACTION: 'open',
          },
        },
        {
          kind: 'block',
          type: 'humanoid_rotate_joint',
          fields: {
            JOINT: 'rightShoulderPitch',
            ANGLE: -45,
          },
        },
      ],
    },
    {
      kind: 'category',
      name: '다리 동작',
      colour: '#FF5722',
      contents: [
        {
          kind: 'block',
          type: 'humanoid_set_leg',
          fields: {
            LEG: 'right',
            HIP_PITCH: 0,
            HIP_YAW: 0,
            KNEE: 0,
            ANKLE: 0,
          },
        },
        {
          kind: 'block',
          type: 'humanoid_rotate_joint',
          fields: {
            JOINT: 'rightKnee',
            ANGLE: 30,
          },
        },
      ],
    },
    {
      kind: 'category',
      name: '제어',
      colour: '#FF9800',
      contents: [
        {
          kind: 'block',
          type: 'humanoid_wait',
          fields: {
            DURATION: 1,
          },
        },
        {
          kind: 'block',
          type: 'controls_repeat_ext',
          inputs: {
            TIMES: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 3,
                },
              },
            },
          },
        },
      ],
    },
    {
      kind: 'category',
      name: '이동',
      colour: '#00BCD4',
      contents: [
        {
          kind: 'block',
          type: 'humanoid_move_forward',
          fields: {
            DISTANCE: 1,
          },
        },
        {
          kind: 'block',
          type: 'humanoid_move_backward',
          fields: {
            DISTANCE: 1,
          },
        },
        {
          kind: 'block',
          type: 'humanoid_move_left',
          fields: {
            DISTANCE: 1,
          },
        },
        {
          kind: 'block',
          type: 'humanoid_move_right',
          fields: {
            DISTANCE: 1,
          },
        },
        {
          kind: 'block',
          type: 'humanoid_jump',
          fields: {
            HEIGHT: 1,
          },
        },
        {
          kind: 'block',
          type: 'humanoid_reset_position',
        },
      ],
    },
    {
      kind: 'sep',
    },
    {
      kind: 'category',
      name: '레거시 (호환용)',
      colour: '#9E9E9E',
      contents: [
        {
          kind: 'block',
          type: 'robot_reset',
        },
        {
          kind: 'block',
          type: 'robot_set_all_joints',
          fields: {
            BASE: 0,
            SHOULDER: 0,
            ELBOW: 0,
          },
        },
        {
          kind: 'block',
          type: 'robot_rotate_joint',
          fields: {
            JOINT: 'base',
            ANGLE: 45,
          },
        },
        {
          kind: 'block',
          type: 'robot_gripper',
          fields: {
            ACTION: 'open',
          },
        },
        {
          kind: 'block',
          type: 'robot_wait',
          fields: {
            DURATION: 1,
          },
        },
      ],
    },
  ],
};
