'use client'

import { SavedProject } from '@/lib/storage'

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function SaveDialog({ isOpen, onClose, onSave }: SaveDialogProps) {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('projectName') as string
    if (name.trim()) {
      onSave(name.trim())
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 shadow-xl border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">프로젝트 저장</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              프로젝트 이름
            </label>
            <input
              type="text"
              name="projectName"
              placeholder="예: 내 첫 번째 로봇 프로그램"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface LoadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projects: SavedProject[];
  onLoad: (project: SavedProject) => void;
  onDelete: (name: string) => void;
}

export function LoadDialog({ isOpen, onClose, projects, onLoad, onDelete }: LoadDialogProps) {
  if (!isOpen) return null

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ko-KR')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">프로젝트 불러오기</h2>
        
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            저장된 프로젝트가 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.name}
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{project.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(project.timestamp)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onLoad(project)
                        onClose()
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      불러오기
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${project.name}" 프로젝트를 삭제하시겠습니까?`)) {
                          onDelete(project.name)
                        }
                      }}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

interface ExamplesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  examples: Array<{ name: string; description: string; xml: string }>;
  onLoad: (xml: string) => void;
}

export function ExamplesDialog({ isOpen, onClose, examples, onLoad }: ExamplesDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">예제 프로그램</h2>
        
        <div className="space-y-3">
          {examples.map((example, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white">{example.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{example.description}</p>
                </div>
                <button
                  onClick={() => {
                    onLoad(example.xml)
                    onClose()
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors ml-4"
                >
                  불러오기
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
