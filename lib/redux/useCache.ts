import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  fetchWorkspaces,
  fetchCurrentWorkspace,
  fetchWorkspaceSettings,
  fetchWorkspaceMembers,
} from './slices/workspaceSlice';
import { fetchUserProfile } from './slices/userSlice';

export function useUserProfile() {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!profile && !loading) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile, loading]);

  return { profile, loading, error, refetch: () => dispatch(fetchUserProfile()) };
}

export function useWorkspaces() {
  const dispatch = useAppDispatch();
  const { workspaces, loading, error } = useAppSelector((state) => state.workspace);

  useEffect(() => {
    if (!workspaces && !loading) {
      dispatch(fetchWorkspaces());
    }
  }, [dispatch, workspaces, loading]);

  return { workspaces, loading, error, refetch: () => dispatch(fetchWorkspaces()) };
}

export function useCurrentWorkspace(workspaceId: string | null) {
  const dispatch = useAppDispatch();
  const { currentWorkspace, loading } = useAppSelector((state) => state.workspace);

  useEffect(() => {
    if (workspaceId && !currentWorkspace) {
      dispatch(fetchCurrentWorkspace(workspaceId));
    }
  }, [dispatch, workspaceId, currentWorkspace]);

  return { workspace: currentWorkspace, loading, refetch: () => workspaceId && dispatch(fetchCurrentWorkspace(workspaceId)) };
}

export function useWorkspaceSettings(workspaceId: string | null) {
  const dispatch = useAppDispatch();
  const { settings, loading } = useAppSelector((state) => state.workspace);

  useEffect(() => {
    if (workspaceId && !settings) {
      dispatch(fetchWorkspaceSettings(workspaceId));
    }
  }, [dispatch, workspaceId, settings]);

  return { settings, loading, refetch: () => workspaceId && dispatch(fetchWorkspaceSettings(workspaceId)) };
}

export function useWorkspaceMembers(workspaceId: string | null) {
  const dispatch = useAppDispatch();
  const { members, loading } = useAppSelector((state) => state.workspace);

  useEffect(() => {
    if (workspaceId && !members) {
      dispatch(fetchWorkspaceMembers(workspaceId));
    }
  }, [dispatch, workspaceId, members]);

  return { members, loading, refetch: () => workspaceId && dispatch(fetchWorkspaceMembers(workspaceId)) };
}
