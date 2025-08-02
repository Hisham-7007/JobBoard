"use client";

type LoadingSpinnerProps = {
  size?: number;
  className?: string;
  color?: string;
  text?: string;
};

export default function LoadingSpinner({
  size = 48,
  className = "",
  color = "border-blue-600",
  text = "Loading...",
}: LoadingSpinnerProps) {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={spinnerStyle}>
        {/* Spinner */}
        <div
          className={`w-full h-full border-4 rounded-full animate-spin ${color} border-t-transparent`}
        ></div>

        {/* Pulse effect */}
        <div
          className={`absolute inset-0 border-4 border-transparent rounded-full animate-ping border-t-blue-400`}
        ></div>
      </div>

      {text && <p className="mt-3 text-gray-600 font-medium">{text}</p>}
    </div>
  );
}
