export function Noise() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW1mzN3M3M7MzMzMjIynp6e8vLy6urqZmZm9vbm5ubnMzMzAva8pKCg8PCg4ODg0KCgsICAgICAgICAgICAgICAgICAgICA9zy3RAAAABnRSTlMAmP//v8C3S8n8AAAAQUlEQVRIx+3SMQoAIAwEwcX7/58LBAstBCst7m6nyN9qnS8LADAYmKijoo6KGmppqKXmTC13as7UvKeWOTV9at664Vcl5Z5C1wAAAABJRU5ErkJggg==")`,
        backgroundRepeat: "repeat",
        backgroundSize: "64px 64px",
      }}
    />
  );
}
