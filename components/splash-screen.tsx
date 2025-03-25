export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen md:ml-64">
      <div className="mt-4 text-lg text-muted-foreground text-center">
        <div>Loading...</div>
        <div className="mt-2 text-sm">This may take a few seconds</div>
      </div>
    </div>
  );
}