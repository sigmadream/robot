import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

// Wasabi 설정 (환경 변수에서 가져옴)
const wasabiClient = new S3Client({
  endpoint: process.env.WASABI_ENDPOINT || 'https://s3.ap-northeast-1.wasabisys.com',
  region: process.env.WASABI_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY || '',
    secretAccessKey: process.env.WASABI_SECRET_KEY || '',
  },
})

const BUCKET_NAME = process.env.WASABI_BUCKET || 'robot-bone-mappings'
const MAPPINGS_PREFIX = 'bone-mappings/'

export interface WasabiBoneMapping {
  modelName: string
  timestamp: number
  mappings: Record<string, string>
  scale?: number
}

// 본 매핑 저장
export async function saveMappingToWasabi(mapping: WasabiBoneMapping): Promise<boolean> {
  try {
    const key = `${MAPPINGS_PREFIX}${encodeURIComponent(mapping.modelName)}.json`

    await wasabiClient.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(mapping),
      ContentType: 'application/json',
    }))

    return true
  } catch (error) {
    console.error('Wasabi 저장 오류:', error)
    return false
  }
}

// 특정 본 매핑 불러오기
export async function loadMappingFromWasabi(modelName: string): Promise<WasabiBoneMapping | null> {
  try {
    const key = `${MAPPINGS_PREFIX}${encodeURIComponent(modelName)}.json`

    const response = await wasabiClient.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }))

    if (response.Body) {
      const bodyString = await response.Body.transformToString()
      return JSON.parse(bodyString)
    }

    return null
  } catch (error: any) {
    if (error.name === 'NoSuchKey') {
      return null
    }
    console.error('Wasabi 조회 오류:', error)
    return null
  }
}

// 모든 본 매핑 목록 불러오기
export async function listAllMappingsFromWasabi(): Promise<WasabiBoneMapping[]> {
  try {
    const response = await wasabiClient.send(new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: MAPPINGS_PREFIX,
    }))

    const mappings: WasabiBoneMapping[] = []

    if (response.Contents) {
      for (const item of response.Contents) {
        if (item.Key && item.Key.endsWith('.json')) {
          try {
            const getResponse = await wasabiClient.send(new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: item.Key,
            }))

            if (getResponse.Body) {
              const bodyString = await getResponse.Body.transformToString()
              const mapping = JSON.parse(bodyString)
              mappings.push(mapping)
            }
          } catch (e) {
            console.error(`파일 읽기 실패: ${item.Key}`, e)
          }
        }
      }
    }

    // 최신순 정렬
    mappings.sort((a, b) => b.timestamp - a.timestamp)

    return mappings
  } catch (error) {
    console.error('Wasabi 목록 조회 오류:', error)
    return []
  }
}

// 본 매핑 삭제
export async function deleteMappingFromWasabi(modelName: string): Promise<boolean> {
  try {
    const key = `${MAPPINGS_PREFIX}${encodeURIComponent(modelName)}.json`

    await wasabiClient.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }))

    return true
  } catch (error) {
    console.error('Wasabi 삭제 오류:', error)
    return false
  }
}
