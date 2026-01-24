import { JointAngles } from './types/robot';

export interface SavedProject {
  name: string;
  timestamp: number;
  workspace: string;
  initialJointAngles?: JointAngles;
}

const STORAGE_KEY = 'robot-blockly-projects';
const CURRENT_PROJECT_KEY = 'robot-blockly-current';

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
