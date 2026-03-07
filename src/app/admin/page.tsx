import SubmissionReview from "@/components/Admin/SubmissionReview";

export const metadata = {
  title: "Admin - closerintime",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main>
      <SubmissionReview />
    </main>
  );
}
