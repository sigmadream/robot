import { NextRequest, NextResponse } from 'next/server'
import {
  saveMappingToWasabi,
  loadMappingFromWasabi,
  listAllMappingsFromWasabi,
  deleteMappingFromWasabi,
  WasabiBoneMapping
} from '@/lib/wasabi'

// GET: 모든 매핑 조회 또는 특정 모델 매핑 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const modelName = searchParams.get('modelName')

    if (modelName) {
      const mapping = await loadMappingFromWasabi(modelName)
      return NextResponse.json(mapping)
    }

    const mappings = await listAllMappingsFromWasabi()
    return NextResponse.json(mappings)
  } catch (error) {
    console.error('GET 오류:', error)
    return NextResponse.json({ error: '매핑을 불러올 수 없습니다.' }, { status: 500 })
  }
}

// POST: 새 매핑 저장 또는 업데이트
export async function POST(request: NextRequest) {
  try {
    const body: WasabiBoneMapping = await request.json()

    if (!body.modelName || !body.mappings) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 })
    }

    const mapping: WasabiBoneMapping = {
      modelName: body.modelName,
      timestamp: Date.now(),
      mappings: body.mappings,
      scale: body.scale,
    }

    const success = await saveMappingToWasabi(mapping)

    if (success) {
      return NextResponse.json({ success: true, mapping })
    } else {
      return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 })
    }
  } catch (error) {
    console.error('POST 오류:', error)
    return NextResponse.json({ error: '매핑을 저장할 수 없습니다.' }, { status: 500 })
  }
}

// DELETE: 매핑 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const modelName = searchParams.get('modelName')

    if (!modelName) {
      return NextResponse.json({ error: 'modelName이 필요합니다.' }, { status: 400 })
    }

    const success = await deleteMappingFromWasabi(modelName)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 })
    }
  } catch (error) {
    console.error('DELETE 오류:', error)
    return NextResponse.json({ error: '매핑을 삭제할 수 없습니다.' }, { status: 500 })
  }
}
