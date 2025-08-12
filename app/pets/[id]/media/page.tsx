import MediaUploader from "@/components/media/media-uploader"
import MediaGrid from "@/components/media/media-grid"

export default async function PetMediaPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto w-full max-w-5xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Media & Documents</h2>
      </div>
      <MediaUploader petId={params.id} />
      <MediaGrid petId={params.id} />
    </div>
  )
}
