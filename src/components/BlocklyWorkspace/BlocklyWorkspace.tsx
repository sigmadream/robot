'use client'

import React, { useEffect, useRef } from 'react'
import Blockly from 'blockly'
import { BLOCKLY_TOOLBOX } from '@/lib/blockly/toolbox'
import { initCustomBlocks } from '@/lib/blockly/customBlocks'
import '@/lib/blockly/codeGenerator'

interface BlocklyWorkspaceProps {
  onWorkspaceChange?: (workspace: Blockly.WorkspaceSvg) => void;
  initialXml?: string;
}

export default function BlocklyWorkspace({ onWorkspaceChange, initialXml }: BlocklyWorkspaceProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null)

  useEffect(() => {
    if (!blocklyDiv.current || workspaceRef.current) return

    // 커스텀 블록 초기화
    initCustomBlocks()

    // Blockly 워크스페이스 생성
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: BLOCKLY_TOOLBOX,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: true,
      move: {
        scrollbars: {
          horizontal: true,
          vertical: true,
        },
        drag: true,
        wheel: true,
      },
    })

    workspaceRef.current = workspace

    // 워크스페이스 변경 이벤트 (UI 이벤트 제외)
    workspace.addChangeListener((event: Blockly.Events.Abstract) => {
      // UI 이벤트는 무시 (드래그 중, 선택, 클릭 등)
      if (event.isUiEvent) return
      // 블록 드래그 중 이벤트 무시
      if (event.type === Blockly.Events.BLOCK_DRAG) return

      if (onWorkspaceChange) {
        onWorkspaceChange(workspace)
      }
    })

    // 초기 블록 또는 저장된 워크스페이스 로드
    if (initialXml) {
      try {
        const xml = Blockly.utils.xml.textToDom(initialXml)
        Blockly.Xml.domToWorkspace(xml, workspace)
      } catch (error) {
        console.error('워크스페이스 로드 오류:', error)
      }
    } else {
      // 기본 예제 블록
      const xml = Blockly.utils.xml.textToDom(`
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="robot_reset" x="20" y="20"></block>
        </xml>
      `)
      Blockly.Xml.domToWorkspace(xml, workspace)
    }

    // 컨테이너 크기 변경 감지 (디바운싱으로 트랜지션 완료 후 리사이즈)
    let resizeTimeout: NodeJS.Timeout | null = null
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        Blockly.svgResize(workspace)
      }, 350) // 트랜지션 시간(300ms)보다 약간 길게
    })
    resizeObserver.observe(blocklyDiv.current)

    // 클린업
    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeObserver.disconnect()
      workspace.dispose()
      workspaceRef.current = null
    }
  }, [])

  // initialXml이 변경되면 워크스페이스 업데이트
  useEffect(() => {
    if (workspaceRef.current && initialXml) {
      try {
        workspaceRef.current.clear()
        const xml = Blockly.utils.xml.textToDom(initialXml)
        Blockly.Xml.domToWorkspace(xml, workspaceRef.current)
      } catch (error) {
        console.error('워크스페이스 업데이트 오류:', error)
      }
    }
  }, [initialXml])

  return (
    <div 
      ref={blocklyDiv} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  )
}

