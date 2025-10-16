"use client"
import { CrealiaStudioInterface } from "@/components/crealia-studio-interface"
import { useRouter } from "next/navigation"

export default function StudioPage() {
  const router = useRouter()

  return <CrealiaStudioInterface isOpen={true} onClose={() => router.push("/")} />
}
