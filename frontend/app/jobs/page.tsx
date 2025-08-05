import { Header } from "@/components/Header";
import { JobListings } from "@/components/JobListings";

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-white/40 backdrop-blur-sm">
      <Header />

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <JobListings />
        </div>
      </section>
    </div>
  );
}
