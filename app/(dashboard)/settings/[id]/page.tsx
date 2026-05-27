import SettingsView from "@/components/settings/settings-view"

export default function WorkspaceSettingsPage({ params }: { params: { id: string } }) {
  return <SettingsView workspaceId={params.id} />
}
