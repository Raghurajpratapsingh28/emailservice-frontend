"use client"

import { use } from "react"
import ContactsView from "@/components/contacts/contacts-view"

interface ContactWorkspacePageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ContactWorkspacePage({ params }: ContactWorkspacePageProps) {
  const { slug } = use(params)
  return <ContactsView workspaceSlug={slug} />
}