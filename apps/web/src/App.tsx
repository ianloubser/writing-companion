import { SidebarLeft } from './components/SidebarLeft';
import { Editor } from './components/Editor';
import { SidebarRight } from './components/SidebarRight';

export default function App() {
  return (
    <div className="layout">
      <SidebarLeft />
      <main className="main-editor">
        <Editor />
      </main>
      <SidebarRight />
    </div>
  );
}
