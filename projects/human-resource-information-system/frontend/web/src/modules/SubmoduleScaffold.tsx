import { getModule } from "@/moduleManifest";
import "@/modules/SubmoduleScaffold.css";

type SubmoduleScaffoldProps = { moduleId: string; pageId: string };

export function SubmoduleScaffold({ moduleId, pageId }: SubmoduleScaffoldProps) {
  const module = getModule(moduleId);
  const page = module?.submodules.find((item) => item.id === pageId);
  if (!module || !page) return null;

  return (
    <article className="submodule-scaffold">
      <div className="submodule-scaffold__heading">
        <div>
          <span className="submodule-scaffold__eyebrow">{module.label}</span>
          <h2>{page.label}</h2>
        </div>
        <span className="submodule-scaffold__badge">Page scaffold</span>
      </div>
      <p>{page.description}</p>
      <div className="submodule-scaffold__empty">
        <span className="submodule-scaffold__mark" aria-hidden="true">+</span>
        <div>
          <h3>Ready for this workflow</h3>
          <p>This page is connected to the {module.label} module. Its data table, forms, and actions can be added here.</p>
        </div>
      </div>
    </article>
  );
}
