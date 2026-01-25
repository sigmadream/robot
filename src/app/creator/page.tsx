'use client'

import { useState, Suspense, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'

const CreatorScene = dynamic(
  () => import('@/components/Creator/CreatorScene'),
  { ssr: false }
)

// 스켈레톤 타입 정의
export type SkeletonType = 'humanSmall' | 'humanMedium' | 'humanLarge' | 'quadruped' | 'biped' | 'bird'

// 탭 타입
type TabType = 'skin' | 'outfit' | 'accessory' | 'external'

// 외부 모델 타입 (Wasabi에서 가져온 모델)
interface ExternalModel {
  id: string
  name: string
  url: string
  type: 'outfit' | 'accessory'
  timestamp?: number
  size?: number
  isLocal?: boolean // 로컬 업로드 (아직 저장 안됨)
}

// 무료 모델 다운로드 소스
const MODEL_SOURCES = [
  {
    name: 'Kenney Modular Characters',
    url: 'https://kenney.nl/assets/modular-characters',
    description: '40개 악세서리 포함 (CC0)'
  },
  {
    name: 'Sketchfab CC0',
    url: 'https://sketchfab.com/tags/cc0',
    description: 'CC0 라이센스 3D 모델'
  },
  {
    name: 'Clothing Kit (CC0)',
    url: 'https://sketchfab.com/3d-models/clothing-and-character-kit-10-cc0-7c733dceb2e04c4fb7e7dbd85316c1e7',
    description: '캐릭터 의상 키트'
  },
  {
    name: 'Quaternius',
    url: 'https://quaternius.com/',
    description: '무료 로우폴리 3D 에셋'
  }
]

// 카테고리별 스켈레톤 분류
const SKELETON_CATEGORIES = {
  human: {
    name: '사람',
    types: ['humanSmall', 'humanMedium', 'humanLarge'] as SkeletonType[]
  },
  animal: {
    name: '동물',
    types: ['quadruped', 'biped', 'bird'] as SkeletonType[]
  }
}

// 스켈레톤 타입별 설정
const SKELETON_CONFIGS: Record<SkeletonType, { name: string; description: string; size: string; category: 'human' | 'animal' }> = {
  humanSmall: {
    name: '소형 인간',
    description: '민첩한 동작에 적합',
    size: '120cm',
    category: 'human'
  },
  humanMedium: {
    name: '중형 인간',
    description: '균형 잡힌 표준 체형',
    size: '170cm',
    category: 'human'
  },
  humanLarge: {
    name: '대형 인간',
    description: '강력한 힘과 안정성',
    size: '220cm',
    category: 'human'
  },
  quadruped: {
    name: '4발 동물',
    description: '개, 고양이, 말 등',
    size: '60~150cm',
    category: 'animal'
  },
  biped: {
    name: '2발 동물',
    description: '공룡, 캥거루 등',
    size: '80~200cm',
    category: 'animal'
  },
  bird: {
    name: '새',
    description: '날개가 있는 조류',
    size: '30~100cm',
    category: 'animal'
  }
}

// 피부색 옵션 (30가지)
const SKIN_COLORS = [
  // 사람 피부톤
  '#FFE0BD', '#FFCD94', '#EAC086', '#D4A373', '#C68642',
  '#8D5524', '#6B4423', '#4A3728', '#FFDFC4', '#F0C8A0',
  // 로봇/판타지 색상
  '#E8E8E8', '#C0C0C0', '#808080', '#4A4A4A', '#2C2C2C',
  '#3B82F6', '#06B6D4', '#10B981', '#8B5CF6', '#EC4899',
  // 특수 색상
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'
]

// 의상 스타일 (30가지)
const OUTFIT_STYLES = [
  { name: '기본', color: '#6B7280', type: 'basic' },
  { name: '캐주얼', color: '#3B82F6', type: 'casual' },
  { name: '정장', color: '#1F2937', type: 'formal' },
  { name: '스포츠', color: '#EF4444', type: 'sport' },
  { name: '군복', color: '#4B5320', type: 'military' },
  { name: '우주복', color: '#F5F5F5', type: 'space' },
  { name: '닌자', color: '#1A1A2E', type: 'ninja' },
  { name: '기사', color: '#B8860B', type: 'knight' },
  { name: '의사', color: '#FFFFFF', type: 'doctor' },
  { name: '소방관', color: '#FF4500', type: 'firefighter' },
  { name: '파일럿', color: '#2F4F4F', type: 'pilot' },
  { name: '요리사', color: '#FFFAF0', type: 'chef' },
  { name: '경찰', color: '#000080', type: 'police' },
  { name: '해적', color: '#8B4513', type: 'pirate' },
  { name: '사이버펑크', color: '#FF00FF', type: 'cyberpunk' },
  { name: '스팀펑크', color: '#CD7F32', type: 'steampunk' },
  { name: '미래전사', color: '#00CED1', type: 'futuristic' },
  { name: '로봇슈트', color: '#708090', type: 'mech' },
  { name: '운동선수', color: '#FF8C00', type: 'athlete' },
  { name: '학생', color: '#4169E1', type: 'student' },
  { name: '왕족', color: '#800080', type: 'royal' },
  { name: '마법사', color: '#4B0082', type: 'wizard' },
  { name: '사무라이', color: '#DC143C', type: 'samurai' },
  { name: '바이킹', color: '#A0522D', type: 'viking' },
  { name: '탐험가', color: '#D2691E', type: 'explorer' },
  { name: '과학자', color: '#E0E0E0', type: 'scientist' },
  { name: '레이서', color: '#FF1493', type: 'racer' },
  { name: 'DJ', color: '#9400D3', type: 'dj' },
  { name: '가수', color: '#FFD700', type: 'singer' },
  { name: '슈퍼히어로', color: '#DC143C', type: 'hero' }
]

// 악세서리 옵션 (30가지)
const ACCESSORY_OPTIONS = [
  { name: '없음', icon: '∅', type: 'none' },
  { name: '안경', icon: '👓', type: 'glasses' },
  { name: '선글라스', icon: '🕶️', type: 'sunglasses' },
  { name: '모자', icon: '🎩', type: 'hat' },
  { name: '헬멧', icon: '⛑️', type: 'helmet' },
  { name: '왕관', icon: '👑', type: 'crown' },
  { name: '헤드폰', icon: '🎧', type: 'headphone' },
  { name: '마스크', icon: '😷', type: 'mask' },
  { name: '스카프', icon: '🧣', type: 'scarf' },
  { name: '넥타이', icon: '👔', type: 'tie' },
  { name: '시계', icon: '⌚', type: 'watch' },
  { name: '팔찌', icon: '📿', type: 'bracelet' },
  { name: '장갑', icon: '🧤', type: 'gloves' },
  { name: '벨트', icon: '🎗️', type: 'belt' },
  { name: '배낭', icon: '🎒', type: 'backpack' },
  { name: '칼', icon: '⚔️', type: 'sword' },
  { name: '방패', icon: '🛡️', type: 'shield' },
  { name: '망토', icon: '🦸', type: 'cape' },
  { name: '날개', icon: '🪽', type: 'wings' },
  { name: '꼬리', icon: '🦊', type: 'tail' },
  { name: '귀', icon: '🐱', type: 'ears' },
  { name: '뿔', icon: '🦌', type: 'horns' },
  { name: '후광', icon: '😇', type: 'halo' },
  { name: '제트팩', icon: '🚀', type: 'jetpack' },
  { name: '가방', icon: '👜', type: 'bag' },
  { name: '카메라', icon: '📷', type: 'camera' },
  { name: '마이크', icon: '🎤', type: 'microphone' },
  { name: '우산', icon: '☂️', type: 'umbrella' },
  { name: '지팡이', icon: '🪄', type: 'wand' },
  { name: '악기', icon: '🎸', type: 'instrument' }
]

export interface CharacterConfig {
  skinColorIndex: number
  outfitIndex: number
  accessoryIndices: number[]
}

export default function CreatorPage() {
  const [skeletonType, setSkeletonType] = useState<SkeletonType>('humanMedium')
  const [activeTab, setActiveTab] = useState<TabType>('skin')
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>({
    skinColorIndex: 0,
    outfitIndex: 0,
    accessoryIndices: []
  })
  const [modelName, setModelName] = useState('내 캐릭터')
  const [isExporting, setIsExporting] = useState(false)
  const [externalModels, setExternalModels] = useState<ExternalModel[]>([])
  const [selectedExternalModel, setSelectedExternalModel] = useState<ExternalModel | null>(null)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Wasabi에서 저장된 모델 목록 불러오기
  const fetchSavedModels = useCallback(async () => {
    setIsLoadingModels(true)
    try {
      const response = await fetch('/api/creator-models')
      if (response.ok) {
        const models = await response.json()
        setExternalModels(models.map((m: ExternalModel) => ({ ...m, isLocal: false })))
      }
    } catch (error) {
      console.error('모델 목록 불러오기 실패:', error)
    } finally {
      setIsLoadingModels(false)
    }
  }, [])

  // 컴포넌트 마운트 시 저장된 모델 불러오기
  useEffect(() => {
    fetchSavedModels()
  }, [fetchSavedModels])

  // GLB 파일 업로드 핸들러 (Wasabi에 저장)
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.glb')) {
      toast.error('GLB 파일만 업로드 가능합니다')
      return
    }

    // 파일 크기 제한 (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('파일 크기는 50MB를 초과할 수 없습니다')
      return
    }

    setIsUploading(true)
    toast.loading('Wasabi에 업로드 중...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'accessory')

      const response = await fetch('/api/creator-models', {
        method: 'POST',
        body: formData,
      })

      toast.dismiss()

      if (response.ok) {
        const data = await response.json()
        const newModel: ExternalModel = {
          ...data.model,
          isLocal: false,
        }
        setExternalModels(prev => [newModel, ...prev])
        setSelectedExternalModel(newModel)
        toast.success(`${file.name} Wasabi에 저장 완료!`)
      } else {
        const error = await response.json()
        toast.error(error.error || '업로드 실패')
      }
    } catch (error) {
      toast.dismiss()
      toast.error('업로드 중 오류가 발생했습니다')
      console.error('업로드 오류:', error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [])

  // 외부 모델 제거 (Wasabi에서도 삭제)
  const handleRemoveExternalModel = useCallback(async (id: string, type: 'outfit' | 'accessory') => {
    const model = externalModels.find(m => m.id === id)
    if (!model) return

    // 로컬 blob URL인 경우 바로 제거
    if (model.isLocal && model.url.startsWith('blob:')) {
      URL.revokeObjectURL(model.url)
      setExternalModels(prev => prev.filter(m => m.id !== id))
      if (selectedExternalModel?.id === id) {
        setSelectedExternalModel(null)
      }
      toast.success('모델 제거됨')
      return
    }

    // Wasabi에서 삭제
    toast.loading('삭제 중...')
    try {
      const response = await fetch(`/api/creator-models?id=${encodeURIComponent(id)}&type=${type}`, {
        method: 'DELETE',
      })

      toast.dismiss()

      if (response.ok) {
        setExternalModels(prev => prev.filter(m => m.id !== id))
        if (selectedExternalModel?.id === id) {
          setSelectedExternalModel(null)
        }
        toast.success('Wasabi에서 삭제됨')
      } else {
        toast.error('삭제 실패')
      }
    } catch (error) {
      toast.dismiss()
      toast.error('삭제 중 오류가 발생했습니다')
    }
  }, [externalModels, selectedExternalModel])

  const handleSkinColorSelect = (index: number) => {
    setCharacterConfig(prev => ({ ...prev, skinColorIndex: index }))
  }

  const handleOutfitSelect = (index: number) => {
    setCharacterConfig(prev => ({ ...prev, outfitIndex: index }))
  }

  const handleAccessoryToggle = (index: number) => {
    setCharacterConfig(prev => {
      const accessories = [...prev.accessoryIndices]
      const existingIndex = accessories.indexOf(index)
      if (existingIndex >= 0) {
        accessories.splice(existingIndex, 1)
      } else {
        if (index === 0) {
          return { ...prev, accessoryIndices: [] }
        }
        accessories.push(index)
      }
      return { ...prev, accessoryIndices: accessories }
    })
  }

  const handleExportGLB = async () => {
    setIsExporting(true)
    toast.loading('GLB 파일 생성 중...')

    const event = new CustomEvent('exportGLB', {
      detail: {
        name: modelName,
        skeleton: skeletonType,
        config: characterConfig
      }
    })
    window.dispatchEvent(event)

    setTimeout(() => {
      toast.dismiss()
      toast.success('GLB 파일이 다운로드됩니다!')
      setIsExporting(false)
    }, 1500)
  }

  const handleRandomize = () => {
    setCharacterConfig({
      skinColorIndex: Math.floor(Math.random() * SKIN_COLORS.length),
      outfitIndex: Math.floor(Math.random() * OUTFIT_STYLES.length),
      accessoryIndices: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
        Math.floor(Math.random() * (ACCESSORY_OPTIONS.length - 1)) + 1
      )
    })
    toast.success('랜덤 캐릭터 생성!')
  }

  return (
    <main className="flex h-screen flex-col bg-gray-900">
      {/* 헤더 */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="홈으로"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              캐릭터 만들기
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              체형, 피부색, 의상을 선택하여 나만의 캐릭터를 만드세요
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRandomize}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 9l-1.41-1.42L10 14.17l-2.59-2.58L6 13l4 4zm-6-7c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"/>
            </svg>
            랜덤
          </button>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm w-40 focus:outline-none focus:border-purple-500"
            placeholder="캐릭터 이름"
          />
          <button
            onClick={handleExportGLB}
            disabled={isExporting}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11h5l-9 10-9-10h5v-11h8v11zm3 8v3h-14v-3h-2v5h18v-5h-2z"/>
            </svg>
            {isExporting ? '내보내는 중...' : 'GLB 내보내기'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 패널 - 스켈레톤 타입 선택 */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col overflow-y-auto">
          <div className="p-4">
            <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
              </svg>
              체형 선택
            </h2>

            {/* 사람 카테고리 */}
            <div className="mb-4">
              <h3 className="text-gray-400 text-xs font-medium mb-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
                </svg>
                사람
              </h3>
              <div className="space-y-2">
                {SKELETON_CATEGORIES.human.types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSkeletonType(type)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      skeletonType === type
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{SKELETON_CONFIGS[type].name}</span>
                      <span className="text-xs opacity-75">{SKELETON_CONFIGS[type].size}</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">{SKELETON_CONFIGS[type].description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 동물 카테고리 */}
            <div>
              <h3 className="text-gray-400 text-xs font-medium mb-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.5 11c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm15 0c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm-7.5-6c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm0 9c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5z"/>
                </svg>
                동물
              </h3>
              <div className="space-y-2">
                {SKELETON_CATEGORIES.animal.types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSkeletonType(type)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      skeletonType === type
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{SKELETON_CONFIGS[type].name}</span>
                      <span className="text-xs opacity-75">{SKELETON_CONFIGS[type].size}</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">{SKELETON_CONFIGS[type].description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 현재 설정 표시 */}
          <div className="p-4 mt-auto border-t border-gray-700">
            <h3 className="text-gray-400 text-xs font-medium mb-2">현재 설정</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-500"
                  style={{ backgroundColor: SKIN_COLORS[characterConfig.skinColorIndex] }}
                />
                <span className="text-gray-300">피부</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border border-gray-500"
                  style={{ backgroundColor: OUTFIT_STYLES[characterConfig.outfitIndex].color }}
                />
                <span className="text-gray-300">{OUTFIT_STYLES[characterConfig.outfitIndex].name}</span>
              </div>
              {characterConfig.accessoryIndices.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {characterConfig.accessoryIndices.map(idx => (
                    <span key={idx} className="text-lg">{ACCESSORY_OPTIONS[idx].icon}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 중앙 - 3D 미리보기 */}
        <div className="flex-1 relative">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-gray-400">로딩 중...</div>
            </div>
          }>
            <CreatorScene
              skeletonType={skeletonType}
              skinColor={SKIN_COLORS[characterConfig.skinColorIndex]}
              outfitStyle={OUTFIT_STYLES[characterConfig.outfitIndex]}
              accessories={characterConfig.accessoryIndices.map(idx => ACCESSORY_OPTIONS[idx])}
              externalModelUrl={selectedExternalModel?.url}
            />
          </Suspense>

          {/* 조작 안내 */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-gray-300 text-xs">마우스로 회전 / 휠로 확대축소</p>
          </div>
        </div>

        {/* 오른쪽 패널 - 스타일 선택 */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* 탭 */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('skin')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'skin'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              피부색
            </button>
            <button
              onClick={() => setActiveTab('outfit')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'outfit'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              의상
            </button>
            <button
              onClick={() => setActiveTab('accessory')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'accessory'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              악세서리
            </button>
            <button
              onClick={() => setActiveTab('external')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'external'
                  ? 'text-white border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              외부
            </button>
          </div>

          {/* 탭 내용 */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'skin' && (
              <div>
                <p className="text-gray-400 text-xs mb-3">30가지 피부색 중 선택하세요</p>
                <div className="grid grid-cols-6 gap-2">
                  {SKIN_COLORS.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => handleSkinColorSelect(i)}
                      className={`aspect-square rounded-lg transition-all ${
                        characterConfig.skinColorIndex === i
                          ? 'ring-2 ring-white scale-110 z-10'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`색상 ${i + 1}`}
                    >
                      {characterConfig.skinColorIndex === i && (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-800 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'outfit' && (
              <div>
                <p className="text-gray-400 text-xs mb-3">30가지 의상 중 선택하세요</p>
                <div className="grid grid-cols-2 gap-2">
                  {OUTFIT_STYLES.map((outfit, i) => (
                    <button
                      key={i}
                      onClick={() => handleOutfitSelect(i)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        characterConfig.outfitIndex === i
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-500"
                          style={{ backgroundColor: outfit.color }}
                        />
                        <span className="text-sm">{outfit.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'accessory' && (
              <div>
                <p className="text-gray-400 text-xs mb-3">악세서리를 선택하세요 (복수 선택 가능)</p>
                <div className="grid grid-cols-3 gap-2">
                  {ACCESSORY_OPTIONS.map((acc, i) => (
                    <button
                      key={i}
                      onClick={() => handleAccessoryToggle(i)}
                      className={`p-3 rounded-lg text-center transition-all ${
                        (i === 0 && characterConfig.accessoryIndices.length === 0) ||
                        characterConfig.accessoryIndices.includes(i)
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{acc.icon}</div>
                      <div className="text-xs">{acc.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'external' && (
              <div className="space-y-4">
                {/* 파일 업로드 */}
                <div>
                  <p className="text-gray-400 text-xs mb-3">GLB 파일을 Wasabi 클라우드에 저장합니다</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".glb"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-green-500 hover:bg-gray-700/50 transition-all text-gray-400 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <svg className="w-8 h-8 mx-auto mb-2 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm">업로드 중...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-sm">GLB 파일 업로드 (Wasabi 저장)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Wasabi에 저장된 모델 목록 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white text-sm font-medium">저장된 모델 (Wasabi)</h4>
                    <button
                      onClick={fetchSavedModels}
                      disabled={isLoadingModels}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      {isLoadingModels ? '로딩...' : '새로고침'}
                    </button>
                  </div>

                  {isLoadingModels ? (
                    <div className="text-center py-4 text-gray-500">
                      <svg className="w-6 h-6 mx-auto animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="mt-2 text-xs">로딩 중...</p>
                    </div>
                  ) : externalModels.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {externalModels.map((model) => (
                        <div
                          key={model.id}
                          className={`p-3 rounded-lg flex items-center justify-between ${
                            selectedExternalModel?.id === model.id
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          <button
                            onClick={() => setSelectedExternalModel(
                              selectedExternalModel?.id === model.id ? null : model
                            )}
                            className="flex-1 text-left truncate"
                          >
                            <span className="text-sm font-medium">{model.name}</span>
                            {model.size && (
                              <span className="text-xs opacity-75 ml-2">
                                ({(model.size / 1024 / 1024).toFixed(1)}MB)
                              </span>
                            )}
                          </button>
                          <button
                            onClick={() => handleRemoveExternalModel(model.id, model.type)}
                            className="p-1 hover:bg-red-500 rounded transition-colors ml-2"
                            title="삭제"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-xs">저장된 모델이 없습니다</p>
                      <p className="text-xs mt-1">GLB 파일을 업로드하세요</p>
                    </div>
                  )}
                </div>

                {/* 무료 모델 다운로드 소스 */}
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white text-sm font-medium mb-2">무료 모델 다운로드</h4>
                  <p className="text-gray-500 text-xs mb-3">아래 사이트에서 CC0 라이센스 GLB 모델을 다운로드 후 업로드하세요</p>
                  <div className="space-y-2">
                    {MODEL_SOURCES.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">{source.name}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">{source.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
