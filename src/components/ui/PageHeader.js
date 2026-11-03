export default function PageHeader({ title, description, actions }) {
  return (
    <header className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
      <div>
        <h1
          className="h3 fw-semibold mb-1"
          style={{ color: "var(--kc-navy, #172554)" }}
        >
          {title}
        </h1>
        {description && <p className="text-secondary mb-0">{description}</p>}
      </div>
      {actions && <div className="d-flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}