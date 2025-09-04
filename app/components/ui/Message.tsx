interface MessageProps {
  text: string;
  color?: string;
}

export function Message({ text, color = "#e74c3c" }: MessageProps) {
  return (
    <div 
      className="text-center py-3 px-5 rounded"
      style={{ backgroundColor: color }}
    >
      <span className="text-white">{text}</span>
    </div>
  );
}