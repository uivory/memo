import { Suspense } from "react";
import { MemoDetailLoader } from "@/components/MemoDetailLoader";

export default function MemoPage({ params }: PageProps<"/memo/[id]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      {params.then(({ id }) => (
        <MemoDetailLoader id={id} />
      ))}
    </Suspense>
  );
}
