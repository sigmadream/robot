# Blender 건담 모델 제작 가이드

## 관절 구조 (22 Joints)

Blender에서 모델링 후 GLTF로 내보낼 때 다음 이름의 Empty 또는 Bone을 사용해야 합니다.

```
Root
├── torso (몸통 Y축 회전)
│   ├── [상체 메시들]
│   ├── neckYaw (목 좌우 Y축)
│   │   └── neckPitch (목 상하 X축)
│   │       └── [머리 메시들]
│   │
│   ├── leftShoulderPitch (왼어깨 상하 X축)
│   │   └── leftShoulderYaw (왼어깨 좌우 Z축)
│   │       └── leftElbow (왼팔꿈치 X축)
│   │           └── leftWrist (왼손목 Z축)
│   │               └── [왼손 메시들]
│   │
│   ├── rightShoulderPitch (오른어깨 상하 X축)
│   │   └── rightShoulderYaw (오른어깨 좌우 Z축)
│   │       └── rightElbow (오른팔꿈치 X축)
│   │           └── rightWrist (오른손목 Z축)
│   │               └── [오른손 메시들]
│   │
│   ├── leftHipYaw (왼엉덩이 좌우 Y축)
│   │   └── leftHipPitch (왼엉덩이 상하 X축)
│   │       └── leftKnee (왼무릎 X축)
│   │           └── leftAnkle (왼발목 X축)
│   │               └── [왼발 메시들]
│   │
│   └── rightHipYaw (오른엉덩이 좌우 Y축)
│       └── rightHipPitch (오른엉덩이 상하 X축)
│           └── rightKnee (오른무릎 X축)
│               └── rightAnkle (오른발목 X축)
│                   └── [오른발 메시들]
```

## 모델링 단계

### 1. 기본 설정
- Blender 새 파일 열기
- 단위를 미터로 설정 (Scene Properties > Units)
- 로봇 높이: 약 6-7 유닛 (발~머리)

### 2. 관절 Empty 생성
```python
# Blender Python 콘솔에서 실행
import bpy

joints = [
    ('torso', (0, 0, 3.5)),
    ('neckYaw', (0, 0, 4.9)),
    ('neckPitch', (0, 0, 5.1)),
    ('leftShoulderPitch', (0.8, 0, 4.3)),
    ('leftShoulderYaw', (0.8, 0, 4.3)),
    ('leftElbow', (1.65, 0, 4.3)),
    ('leftWrist', (2.4, 0, 4.3)),
    ('rightShoulderPitch', (-0.8, 0, 4.3)),
    ('rightShoulderYaw', (-0.8, 0, 4.3)),
    ('rightElbow', (-1.65, 0, 4.3)),
    ('rightWrist', (-2.4, 0, 4.3)),
    ('leftHipYaw', (0.35, 0, 2.5)),
    ('leftHipPitch', (0.35, 0, 2.5)),
    ('leftKnee', (0.35, 0, 1.4)),
    ('leftAnkle', (0.35, 0, 0.3)),
    ('rightHipYaw', (-0.35, 0, 2.5)),
    ('rightHipPitch', (-0.35, 0, 2.5)),
    ('rightKnee', (-0.35, 0, 1.4)),
    ('rightAnkle', (-0.35, 0, 0.3)),
]

for name, loc in joints:
    bpy.ops.object.empty_add(type='ARROWS', location=loc)
    bpy.context.object.name = name
```

### 3. 메시 모델링
- 각 파트별로 별도의 메시 오브젝트 생성
- 관절 Empty의 자식으로 설정 (Ctrl+P > Object)
- 부드러운 곡면: Subdivision Surface 모디파이어
- 날카로운 엣지: Edge에 Bevel 또는 Crease

### 4. 머티리얼 설정
```
- 화이트 아머: Metallic 0.7, Roughness 0.25
- 블루 파츠: Metallic 0.6, Roughness 0.35
- 레드 파츠: Metallic 0.5, Roughness 0.4
- 옐로우 파츠: Metallic 0.8, Roughness 0.2
- 다크그레이 관절: Metallic 0.9, Roughness 0.3
- 눈 (발광): Emission 강도 1.5
```

### 5. GLTF 내보내기
1. File > Export > glTF 2.0
2. 설정:
   - Format: glTF Binary (.glb)
   - Include: Selected Objects (필요시)
   - Transform: +Y Up
   - Geometry: Apply Modifiers 체크
   - Animation: 체크 해제 (관절은 코드에서 제어)
3. `/public/models/gundam.glb`로 저장

## 회전축 정리

| 관절 | 회전축 | 설명 |
|------|--------|------|
| torso | Y | 몸통 좌우 회전 |
| neckYaw | Y | 고개 좌우 |
| neckPitch | X | 고개 상하 |
| *ShoulderPitch | X | 팔 앞뒤 |
| *ShoulderYaw | Z | 팔 옆으로 펼치기 |
| *Elbow | X | 팔꿈치 굽힘 |
| *Wrist | Z | 손목 회전 |
| *HipYaw | Y | 다리 좌우 |
| *HipPitch | X | 다리 앞뒤 |
| *Knee | X | 무릎 굽힘 |
| *Ankle | X | 발목 굽힘 |

## 테스트

모델 파일을 `/public/models/gundam.glb`에 저장 후:

```tsx
// RobotScene.tsx에서
<HumanoidRobot jointAngles={jointAngles} useGLTFModel={true} />
```

## 추천 리소스

- Blender 공식 튜토리얼: https://www.blender.org/support/tutorials/
- GLTF 내보내기 가이드: https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html
- 무료 건담 참고 모델: Sketchfab에서 "Gundam" 검색
