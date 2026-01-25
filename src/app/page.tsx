'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            로봇 시뮬레이터
          </h1>
          <p className="text-xl text-gray-400">
            나만의 로봇을 만들고 블록 코딩으로 제어하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 모델 만들기 카드 */}
          <Link href="/creator" className="group">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 h-full transition-all duration-300 hover:border-purple-500 hover:bg-gray-800/80 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                모델 만들기
              </h2>
              <p className="text-gray-400 mb-6">
                3가지 기본 뼈대 중 선택하고, 부위별 30가지 샘플에서 외형을 조합하여 나만의 로봇을 만드세요.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  3가지 스켈레톤 타입
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  부위별 30가지 외형 선택
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  GLB 파일로 내보내기
                </li>
              </ul>
              <div className="mt-6 flex items-center text-purple-400 font-medium">
                시작하기
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </div>
            </div>
          </Link>

          {/* 조작하기 카드 */}
          <Link href="/simulator" className="group">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 h-full transition-all duration-300 hover:border-blue-500 hover:bg-gray-800/80 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l9 5.146-9 4.854z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                조작하기
              </h2>
              <p className="text-gray-400 mb-6">
                블록 코딩으로 22관절 휴머노이드 로봇을 프로그래밍하고 시뮬레이션하세요.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  블록 코딩 & Python
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  3D 실시간 시뮬레이션
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  외부 GLB 모델 지원
                </li>
              </ul>
              <div className="mt-6 flex items-center text-blue-400 font-medium">
                시작하기
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12 text-gray-500 text-sm">
          마우스를 올려 카드를 선택하세요
        </div>
      </div>
    </main>
  )
}
