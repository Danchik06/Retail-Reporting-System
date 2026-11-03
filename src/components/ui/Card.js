export default function Card({ title, icon, actions, children, className = "" }) {
  return (
    <section className={`card h-100 ${className}`}>
      {(title || actions) && (
        <div className="card-header bg-transparent d-flex align-items-center justify-content-between gap-2">
          <h2 className="h6 fw-semibold mb-0 d-flex align-items-center gap-2">
            {icon && (
              <i
                className={`bi bi-${icon}`}
                style={{ color: "var(--kc-teal, #0D9488)" }}
                aria-hidden="true"
              ></i>
            )}
            {title}
          </h2>
          {actions}
        </div>
      )}
      <div className="card-body">{children}</div>
    </section>
  );
}