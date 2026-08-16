import { SidebarLeft } from './components/SidebarLeft';
import { Editor } from './components/Editor';
import { SidebarRight } from './components/SidebarRight';

export default function App() {
  return (
    <div className="grid h-screen grid-cols-[240px_1fr_300px]">
      <SidebarLeft />
      <main className="min-w-0 bg-background">
        <Editor />
      </main>
      <SidebarRight />
    </div>
  );
}
