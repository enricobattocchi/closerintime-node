import { getEnabledEvents } from "@/lib/events";
import Chooser from "@/components/Chooser/Chooser";

export default function Home() {
  const allEvents = getEnabledEvents();

  return (
    <main>
      <Chooser allEvents={allEvents} selectedEvents={[]} />
    </main>
  );
}
