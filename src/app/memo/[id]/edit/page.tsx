import { Suspense } from "react";
import { MemoEditLoader } from "@/components/MemoDetailLoader";

export default function MemoEditPage({ params }: PageProps<"/memo/[id]/edit">) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      {params.then(({ id }) => (
        <MemoEditLoader id={id} />
      ))}
    </Suspense>
  );
}
