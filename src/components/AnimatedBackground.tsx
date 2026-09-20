// Fixed, full-viewport animated gradient mesh - sits behind all page content.
// Pure CSS animation (see .bg-mesh in globals.css), no client JS needed.
export default function AnimatedBackground() {
  return (
    <div className="bg-mesh" aria-hidden="true">
      <span />
    </div>
  );
}
