import { JointAngles, HumanoidJointKey } from './types/robot';

export interface SavedProject {
  name: string;
  timestamp: number;
  workspace: string;
  initialJointAngles?: JointAngles;
}

export interface SavedBoneMapping {
  modelName: string;
  timestamp: number;
  mappings: Record<HumanoidJointKey, string>;
  scale?: number;
}

const STORAGE_KEY = 'robot-blockly-projects';
const CURRENT_PROJECT_KEY = 'robot-blockly-current';
const BONE_MAPPING_KEY = 'robot-bone-mappings';

// 프로젝트 저장
export const saveProject = (name: string, workspaceXml: string, jointAngles?: JointAngles): void => {
  const projects = getAllProjects();
  const project: SavedProject = {
    name,
    timestamp: Date.now(),
    workspace: workspaceXml,
    initialJointAngles: jointAngles,
  };

  const existingIndex = projects.findIndex(p => p.name === name);
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

// 모든 프로젝트 불러오기
export const getAllProjects = (): SavedProject[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// 특정 프로젝트 불러오기
export const loadProject = (name: string): SavedProject | null => {
  const projects = getAllProjects();
  return projects.find(p => p.name === name) || null;
};

// 프로젝트 삭제
export const deleteProject = (name: string): void => {
  const projects = getAllProjects().filter(p => p.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

// 현재 작업 중인 워크스페이스 자동 저장
export const saveCurrentWorkspace = (workspaceXml: string): void => {
  localStorage.setItem(CURRENT_PROJECT_KEY, workspaceXml);
};

// 현재 작업 중인 워크스페이스 불러오기
export const loadCurrentWorkspace = (): string | null => {
  return localStorage.getItem(CURRENT_PROJECT_KEY);
};

// 본 매핑 저장
export const saveBoneMapping = (
  modelName: string,
  mappings: Record<HumanoidJointKey, string>,
  scale?: number
): void => {
  const allMappings = getAllBoneMappings();
  const mapping: SavedBoneMapping = {
    modelName,
    timestamp: Date.now(),
    mappings,
    scale,
  };

  const existingIndex = allMappings.findIndex(m => m.modelName === modelName);
  if (existingIndex >= 0) {
    allMappings[existingIndex] = mapping;
  } else {
    allMappings.push(mapping);
  }

  localStorage.setItem(BONE_MAPPING_KEY, JSON.stringify(allMappings));
};

// 모든 본 매핑 불러오기
export const getAllBoneMappings = (): SavedBoneMapping[] => {
  const data = localStorage.getItem(BONE_MAPPING_KEY);
  return data ? JSON.parse(data) : [];
};

// 특정 모델의 본 매핑 불러오기
export const loadBoneMapping = (modelName: string): SavedBoneMapping | null => {
  const allMappings = getAllBoneMappings();
  return allMappings.find(m => m.modelName === modelName) || null;
};

// 본 매핑 삭제
export const deleteBoneMapping = (modelName: string): void => {
  const allMappings = getAllBoneMappings().filter(m => m.modelName !== modelName);
  localStorage.setItem(BONE_MAPPING_KEY, JSON.stringify(allMappings));
};

// ============================================
// 서버 API 기반 본 매핑 함수들
// ============================================

const API_BASE = '/api/bone-mappings';

// 서버에 본 매핑 저장
export const saveBoneMappingToServer = async (
  modelName: string,
  mappings: Record<HumanoidJointKey, string>,
  scale?: number
): Promise<boolean> => {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelName, mappings, scale }),
    });

    if (!response.ok) {
      throw new Error('서버 저장 실패');
    }

    // 로컬에도 동시 저장 (백업)
    saveBoneMapping(modelName, mappings, scale);

    return true;
  } catch (error) {
    console.error('서버 저장 오류:', error);
    // 서버 실패 시 로컬에만 저장
    saveBoneMapping(modelName, mappings, scale);
    return false;
  }
};

// 서버에서 모든 본 매핑 불러오기
export const getAllBoneMappingsFromServer = async (): Promise<SavedBoneMapping[]> => {
  try {
    const response = await fetch(API_BASE);

    if (!response.ok) {
      throw new Error('서버 조회 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('서버 조회 오류:', error);
    // 서버 실패 시 로컬에서 불러오기
    return getAllBoneMappings();
  }
};

// 서버에서 특정 모델의 본 매핑 불러오기
export const loadBoneMappingFromServer = async (modelName: string): Promise<SavedBoneMapping | null> => {
  try {
    const response = await fetch(`${API_BASE}?modelName=${encodeURIComponent(modelName)}`);

    if (!response.ok) {
      throw new Error('서버 조회 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('서버 조회 오류:', error);
    // 서버 실패 시 로컬에서 불러오기
    return loadBoneMapping(modelName);
  }
};

// 서버에서 본 매핑 삭제
export const deleteBoneMappingFromServer = async (modelName: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}?modelName=${encodeURIComponent(modelName)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('서버 삭제 실패');
    }

    // 로컬에서도 삭제
    deleteBoneMapping(modelName);

    return true;
  } catch (error) {
    console.error('서버 삭제 오류:', error);
    // 서버 실패 시 로컬에서만 삭제
    deleteBoneMapping(modelName);
    return false;
  }
};
